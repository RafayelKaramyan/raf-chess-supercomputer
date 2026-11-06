export type EngineResult = {
  depth: number;
  scoreCp: number | null;
  mate: number | null;
  bestMove: string;
  principalVariation: string[];
};

export function analyzePosition(fen: string, depth = 15): Promise<EngineResult> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("stockfish/stockfish-19-lite-single.js", document.baseURI).toString());
    let latest: EngineResult = { depth: 0, scoreCp: null, mate: null, bestMove: "", principalVariation: [] };
    let settled = false;
    const finish = (error?: Error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      worker.terminate();
      if (error) reject(error);
      else resolve(latest);
    };
    const timeout = window.setTimeout(() => finish(new Error("Շարժիչը չպատասխանեց սահմանված ժամանակում։")), 45000);

    worker.onerror = () => finish(new Error("Չհաջողվեց գործարկել Stockfish-ը։ Ստուգիր ինտերնետային կապը և կրկին փորձիր։"));
    worker.onmessage = (event: MessageEvent<string>) => {
      const line = String(event.data ?? "").trim();
      if (line === "uciok") {
        worker.postMessage("isready");
        return;
      }
      if (line === "readyok") {
        worker.postMessage(`position fen ${fen}`);
        worker.postMessage(`go depth ${depth}`);
        return;
      }
      if (line.startsWith("info ")) {
        const depthMatch = line.match(/\bdepth (\d+)/);
        const cpMatch = line.match(/\bscore cp (-?\d+)/);
        const mateMatch = line.match(/\bscore mate (-?\d+)/);
        const pvMatch = line.match(/\bpv (.+)$/);
        if (depthMatch) latest.depth = Number(depthMatch[1]);
        if (cpMatch) { latest.scoreCp = Number(cpMatch[1]); latest.mate = null; }
        if (mateMatch) { latest.mate = Number(mateMatch[1]); latest.scoreCp = null; }
        if (pvMatch) latest.principalVariation = pvMatch[1].split(" ");
        return;
      }
      if (line.startsWith("bestmove ")) {
        latest.bestMove = line.split(/\s+/)[1] ?? "";
        if (!latest.bestMove || latest.bestMove === "(none)") finish(new Error("Այս դիրքում օրինական քայլ չկա։"));
        else finish();
      }
    };
    worker.postMessage("uci");
  });
}
