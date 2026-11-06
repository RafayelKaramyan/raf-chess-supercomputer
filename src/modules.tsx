import { useMemo, useState } from "react";
import { Chess } from "chess.js";
import { Activity, BookOpen, Brain, Plus, Target, Trash2 } from "lucide-react";
type OpeningEntry = { id: string; name: string; pgn: string; notes: string };
type OpponentEntry = { id: string; name: string; color: string; pgn: string; notes: string };
export function OpeningLab() {
 const [items,setItems]=useState<OpeningEntry[]>(()=>{try{return JSON.parse(localStorage.getItem("raf-opening-lines")||"[]")}catch{return[]}});
 const [name,setName]=useState("English Opening"),[pgn,setPgn]=useState("1. c4"),[notes,setNotes]=useState(""),[error,setError]=useState("");
 const save=()=>{if(!name.trim()||!pgn.trim()){setError("Enter an opening name and a PGN line.");return;}try{const game=new Chess();game.loadPgn(pgn);if(!game.history().length){setError("Add at least one legal move in PGN notation.");return;}const next=[{id:Date.now().toString(),name:name.trim(),pgn:game.pgn(),notes:notes.trim()},...items];setItems(next);localStorage.setItem("raf-opening-lines",JSON.stringify(next));setError("");setNotes("");setPgn("");}catch{setError("The line is not valid PGN. Check the move order and notation.");}};
 const remove=(id:string)=>{const next=items.filter(x=>x.id!==id);setItems(next);localStorage.setItem("raf-opening-lines",JSON.stringify(next));};
 return <><div className="page-heading"><div><div className="eyebrow">REPERTOIRE DEVELOPMENT</div><h1>Opening lab</h1><p>Build and maintain your own opening files. Lines are checked for legal PGN move order.</p></div></div>
 <section className="panel"><div className="panel-head"><div><div className="eyebrow">REPERTOIRE EDITOR</div><h2>Add an opening line</h2></div><span className="tag">PGN VALIDATION</span></div><div className="module-form"><label>LINE NAME</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. English Opening — ...c6 setup"/><label>PGN MOVES</label><textarea value={pgn} onChange={e=>setPgn(e.target.value)} placeholder="1. c4 e5 2. Nc3 Nf6"/><label>IDEAS / NOTES</label><textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Plans, pawn structures, key squares, move-order details..."/>{error&&<p className="form-error">{error}</p>}<button className="primary" onClick={save}><Plus size={15}/> Save repertoire line</button></div></section>
 <section className="panel module-list-panel"><div className="panel-head"><div><div className="eyebrow">YOUR DATABASE</div><h2>Saved repertoire lines</h2></div><span className="tag">{items.length} LINES</span></div>{items.length===0?<div className="empty-state"><div className="empty-icon"><BookOpen/></div><b>Your repertoire is empty</b><span>Add your first line above. The data stays in this browser.</span></div>:<div className="module-list">{items.map(item=><div className="module-item" key={item.id}><div className="module-item-main"><b>{item.name}</b><code>{item.pgn}</code>{item.notes&&<p>{item.notes}</p>}</div><button className="delete-game" onClick={()=>remove(item.id)} title="Delete line"><Trash2 size={14}/></button></div>)}</div>}</section></>;
}
type StoredGame = { id: string; name: string; pgn: string; savedAt: string };
type TacticEntry={id:string;title:string;fen:string;solution:string;notes:string};
function playSanLine(fen:string,line:string){
 const game=new Chess(fen);
 const clean=line.replace(/\{[^}]*\}/g," ").replace(/\([^)]*\)/g," ").replace(/\d+\.(?:\.\.)?/g," ").trim();
 const tokens=clean.split(/\s+/).filter(token=>token&&!["1-0","0-1","1/2-1/2","*"].includes(token));
 for(const token of tokens)game.move(token);
 return game.history();
}
export function TacticalTrainer(){
 const [items,setItems]=useState<TacticEntry[]>(()=>{try{return JSON.parse(localStorage.getItem("raf-tactics")||"[]")}catch{return[]}});
 const [title,setTitle]=useState("Calculation exercise"),[fen,setFen]=useState(""),[solution,setSolution]=useState(""),[notes,setNotes]=useState(""),[error,setError]=useState("");
 const [active,setActive]=useState<TacticEntry|null>(null),[answer,setAnswer]=useState(""),[feedback,setFeedback]=useState("");
 const save=()=>{try{if(!title.trim()||!fen.trim()||!solution.trim()){setError("Enter a title, FEN position, and solution line.");return;}const moves=playSanLine(fen,solution);if(!moves.length){setError("The solution must contain at least one legal move.");return;}const normalized=moves.join(" ");const next=[{id:Date.now().toString(),title:title.trim(),fen:fen.trim(),solution:normalized,notes:notes.trim()},...items];setItems(next);localStorage.setItem("raf-tactics",JSON.stringify(next));setError("");setSolution("");setNotes("");}catch{setError("Invalid FEN or illegal SAN solution. Verify the position and move order.");}};
 const remove=(id:string)=>{const next=items.filter(x=>x.id!==id);setItems(next);localStorage.setItem("raf-tactics",JSON.stringify(next));if(active?.id===id)setActive(null);};
 const check=()=>{if(!active)return;try{const moves=playSanLine(active.fen,answer);const expected=active.solution.split(" ");setFeedback(moves.length===expected.length&&moves.every((m,i)=>m===expected[i])?"Correct line. The entered moves match the saved solution.":"Not the saved solution. Recalculate the position and try again.");}catch{setFeedback("The entered line contains an illegal move or invalid SAN.");}};
 return <><div className="page-heading"><div><div className="eyebrow">CALCULATION TRAINING</div><h1>Tactical trainer</h1><p>Create your own FEN-based exercises and validate your calculated SAN line against the saved solution.</p></div></div>
 <div className="tactics-layout"><section className="panel"><div className="panel-head"><div><div className="eyebrow">EXERCISE BUILDER</div><h2>Add a position</h2></div><span className="tag">LEGAL MOVE CHECK</span></div><div className="module-form"><label>EXERCISE TITLE</label><input value={title} onChange={e=>setTitle(e.target.value)}/><label>STARTING FEN</label><textarea value={fen} onChange={e=>setFen(e.target.value)} placeholder="Paste a FEN position..."/><label>SOLUTION LINE · SAN</label><textarea value={solution} onChange={e=>setSolution(e.target.value)} placeholder="1. Nxf7 Kxf7 2. Qxd8"/><label>TRAINING NOTE</label><textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Theme, candidate moves, calculation cues..."/>{error&&<p className="form-error">{error}</p>}<button className="primary" onClick={save}><Plus size={15}/> Save exercise</button></div></section>
 <section className="panel"><div className="panel-head"><div><div className="eyebrow">PRACTICE MODE</div><h2>{active?active.title:"Choose an exercise"}</h2></div>{active&&<button className="secondary" onClick={()=>{setActive(null);setFeedback("");setAnswer("");}}>Close</button>}</div>{active?<div className="practice-box"><label>POSITION FEN</label><code>{active.fen}</code><p className="muted">Calculate the full line from the side to move. Enter SAN moves separated by spaces.</p><textarea value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="Enter your calculated line..."/><button className="primary" onClick={check}>Check solution</button>{feedback&&<p className={feedback.startsWith("Correct")?"form-success":"form-error"}>{feedback}</p>}{active.notes&&<p className="muted">{active.notes}</p>}</div>:<div className="empty-state"><div className="empty-icon"><Target/></div><b>No exercise selected</b><span>Choose a saved exercise below to practice.</span></div>}</section></div>
 <section className="panel module-list-panel"><div className="panel-head"><div><div className="eyebrow">PUZZLE LIBRARY</div><h2>Your exercises</h2></div><span className="tag">{items.length} EXERCISES</span></div>{items.length===0?<div className="empty-state"><div className="empty-icon"><Activity/></div><b>No exercises saved</b><span>Add a FEN and a legal solution line to build your private puzzle set.</span></div>:<div className="module-list">{items.map(item=><div className="module-item" key={item.id}><div className="module-item-main"><b>{item.title}</b><code>{item.solution}</code></div><button className="secondary" onClick={()=>{setActive(item);setAnswer("");setFeedback("");}}>Practice</button><button className="delete-game" onClick={()=>remove(item.id)} title="Delete exercise"><Trash2 size={14}/></button></div>)}</div>}</section>
 <p className="muted">This validates move legality and compares your SAN sequence with the exercise author’s saved line. It does not independently verify that the line is objectively best; engine validation is a future integration.</p></>;
}

export function PerformanceLab() {
 const [games] = useState<StoredGame[]>(()=>{try{return JSON.parse(localStorage.getItem("raf-saved-games")||"[]")}catch{return[]}});
 const reports=games.map(item=>{try{const game=new Chess();game.loadPgn(item.pgn);const result=game.header().Result||"*";return {id:item.id,name:item.name,savedAt:item.savedAt,plies:game.history().length,result};}catch{return {id:item.id,name:item.name,savedAt:item.savedAt,plies:0,result:"?"};}});
 const totalPlies=reports.reduce((sum,item)=>sum+item.plies,0);
 const decisive=reports.filter(item=>item.result==="1-0"||item.result==="0-1").length;
 const draws=reports.filter(item=>item.result==="1/2-1/2").length;
 const unfinished=reports.length-decisive-draws;
 return <><div className="page-heading"><div><div className="eyebrow">PROGRESS & DIAGNOSIS</div><h1>Performance report</h1><p>Descriptive statistics from games you have saved. No engine accuracy or evaluation is inferred.</p></div></div>
 <div className="stats-grid"><div className="stat-card"><span>SAVED GAMES</span><strong>{reports.length}</strong><small>PGNs in this browser</small></div><div className="stat-card"><span>TOTAL PLIES</span><strong>{totalPlies}</strong><small>Half-moves recorded</small></div><div className="stat-card"><span>AVERAGE PLIES / GAME</span><strong>{reports.length?Math.round(totalPlies/reports.length):0}</strong><small>Descriptive average</small></div><div className="stat-card"><span>DECIDED GAMES</span><strong>{decisive}</strong><small>{draws} draws · {unfinished} unfinished / unknown</small></div></div>
 <section className="panel module-list-panel"><div className="panel-head"><div><div className="eyebrow">GAME LOG</div><h2>Saved game history</h2></div><span className="tag">LOCAL DATA</span></div>{reports.length===0?<div className="empty-state"><div className="empty-icon">♟</div><b>No performance data yet</b><span>Save PGN games in Player Mode to populate this report.</span></div>:<div className="module-list">{reports.map(item=><div className="module-item" key={item.id}><div className="module-item-main"><b>{item.name}</b><p>{item.savedAt} · {item.plies} plies · Result: {item.result}</p></div></div>)}</div>}</section>
 <p className="muted">Engine-based accuracy, blunder classification, opening statistics, and rating-performance trends will appear only after real game analysis is integrated.</p></>;
}

export function OpponentLab() {
 const [items,setItems]=useState<OpponentEntry[]>(()=>{try{return JSON.parse(localStorage.getItem("raf-opponents")||"[]")}catch{return[]}});
 const [name,setName]=useState(""),[color,setColor]=useState("Both"),[pgn,setPgn]=useState(""),[notes,setNotes]=useState(""),[error,setError]=useState("");
 const save=()=>{if(!name.trim()){setError("Enter the opponent name or an anonymized label.");return;}if(pgn.trim()){try{const game=new Chess();game.loadPgn(pgn);}catch{setError("The supplied game is not valid PGN.");return;}}const next=[{id:Date.now().toString(),name:name.trim(),color,pgn:pgn.trim(),notes:notes.trim()},...items];setItems(next);localStorage.setItem("raf-opponents",JSON.stringify(next));setName("");setPgn("");setNotes("");setError("");};
 const remove=(id:string)=>{const next=items.filter(x=>x.id!==id);setItems(next);localStorage.setItem("raf-opponents",JSON.stringify(next));};
 return <><div className="page-heading"><div><div className="eyebrow">PREPARATION WORKSPACE</div><h1>Opponent lab</h1><p>Collect opponent games and preparation notes. A playing-style diagnosis requires a meaningful sample of games.</p></div></div>
 <section className="panel"><div className="panel-head"><div><div className="eyebrow">OPPONENT PROFILE</div><h2>Add preparation data</h2></div><span className="tag">GAME-BASED</span></div><div className="module-form"><label>OPPONENT NAME / ANONYMIZED ID</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Opponent A"/><label>COLOR TO PREPARE AGAINST</label><select value={color} onChange={e=>setColor(e.target.value)}><option>Both</option><option>White</option><option>Black</option></select><label>GAME PGN (OPTIONAL)</label><textarea value={pgn} onChange={e=>setPgn(e.target.value)} placeholder="Paste one game in PGN format..."/><label>PREPARATION NOTES</label><textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Observed openings, recurring decisions, candidate plans..."/>{error&&<p className="form-error">{error}</p>}<button className="primary" onClick={save}><Plus size={15}/> Save opponent profile</button></div></section>
 <section className="panel module-list-panel"><div className="panel-head"><div><div className="eyebrow">SCOUTING DATABASE</div><h2>Opponent profiles</h2></div><span className="tag">{items.length} PROFILES</span></div>{items.length===0?<div className="empty-state"><div className="empty-icon"><Brain/></div><b>No opponent profiles</b><span>Add an opponent and attach games or notes to begin preparation.</span></div>:<div className="module-list">{items.map(item=><div className="module-item" key={item.id}><div className="module-item-main"><b>{item.name} <span className="tag">{item.color}</span></b>{item.pgn&&<code>{item.pgn}</code>}{item.notes&&<p>{item.notes}</p>}</div><button className="delete-game" onClick={()=>remove(item.id)} title="Delete opponent"><Trash2 size={14}/></button></div>)}</div>}</section></>;
}


type ReviewMove = import("chess.js").Move;
const reviewFiles = ["a","b","c","d","e","f","g","h"];
const reviewGlyph: Record<string,string> = {wk:"♔",wq:"♕",wr:"♖",wb:"♗",wn:"♘",wp:"♙",bk:"♚",bq:"♛",br:"♜",bb:"♝",bn:"♞",bp:"♟"};

export function GameReviewLab() {
 const [pgn,setPgn]=useState("");
 const [moves,setMoves]=useState<ReviewMove[]>([]);
 const [headers,setHeaders]=useState<Record<string,string>>({});
 const [index,setIndex]=useState(0);
 const [orientation,setOrientation]=useState<"white"|"black">("white");
 const [error,setError]=useState("");
 const load=()=>{
  try{
   const parsed=new Chess();
   parsed.loadPgn(pgn);
   setMoves(parsed.history({verbose:true}));
   setHeaders(parsed.getHeaders());
   setIndex(0);
   setError("");
  }catch{
   setError("PGN could not be parsed. Check the notation and move order.");
  }
 };
 const position=useMemo(()=>{
  const current=new Chess();
  for(const move of moves.slice(0,index)){
   current.move({from:move.from,to:move.to,promotion:move.promotion});
  }
  return current;
 },[moves,index]);
 const board=position.board();
 const squares=orientation==="white"
  ?board.flatMap((row,r)=>row.map((piece,c)=>({piece,sq:(reviewFiles[c]+(8-r)) as import("chess.js").Square,r,c})))
  :[...board].reverse().flatMap((row,r)=>[...row].reverse().map((piece,c)=>({piece,sq:(reviewFiles[7-c]+(r+1)) as import("chess.js").Square,r,c})));
 const copyFen=async()=>{
  try{await navigator.clipboard.writeText(position.fen());setError("FEN copied to clipboard.");}
  catch{setError("Clipboard access is unavailable. Select and copy the FEN below.");}
 };
 const copyPgn=async()=>{
  try{await navigator.clipboard.writeText(moves.length?(()=>{const g=new Chess();for(const move of moves)g.move({from:move.from,to:move.to,promotion:move.promotion});return g.pgn();})():"");setError("PGN copied to clipboard.");}
  catch{setError("Clipboard access is unavailable.");}
 };
 return <>
  <div className="page-heading"><div><div className="eyebrow">POST-GAME STUDY / MOVE-BY-MOVE REPLAY</div><h1>Game review</h1><p>Import a PGN, replay every move, inspect positions, and copy FEN for deeper analysis.</p></div><div className="board-actions"><button className="secondary" onClick={()=>setOrientation(orientation==="white"?"black":"white")}>Flip board</button><button className="secondary" onClick={copyPgn} disabled={!moves.length}>Copy PGN</button></div></div>
  <div className="review-layout">
   <section className="board-panel">
    <div className="board-topline"><span><i className="status-dot"/>{index===0?"Starting position":index===moves.length?"Final position":`After ${index} half-moves`}</span><span>{position.turn()==="w"?"WHITE":"BLACK"} TO MOVE</span></div>
    <div className="board-wrap"><div className="chessboard">{squares.map(({piece,sq,r,c})=><div key={sq} className={`square ${(r+c)%2===0?"light":"dark"}`}>{piece&&<span className={piece.color==="w"?"piece white-piece":"piece black-piece"}>{reviewGlyph[piece.color+piece.type]}</span>}{c===0&&<small className="rank">{orientation==="white"?8-r:r+1}</small>}{r===7&&<small className="file">{orientation==="white"?reviewFiles[c]:reviewFiles[7-c]}</small>}</div>)}</div></div>
    <div className="review-controls"><button className="secondary" onClick={()=>setIndex(0)} disabled={!moves.length||index===0}>Start</button><button className="secondary" onClick={()=>setIndex(Math.max(0,index-1))} disabled={index===0}>Previous</button><strong>{index} / {moves.length}</strong><button className="primary" onClick={()=>setIndex(Math.min(moves.length,index+1))} disabled={index===moves.length}>Next</button><button className="secondary" onClick={()=>setIndex(moves.length)} disabled={!moves.length||index===moves.length}>End</button></div>
    <div className="fen-box"><div className="panel-head"><b>Current FEN</b><button className="secondary" onClick={copyFen}>Copy FEN</button></div><code>{position.fen()}</code></div>
   </section>
   <section className="panel review-side">
    <div className="panel-head"><div><div className="eyebrow">GAME DETAILS</div><h2>{headers.Event||"Imported game"}</h2></div><span className="tag">{moves.length} PLIES</span></div>
    <div className="review-meta"><span>White <b>{headers.White||"—"}</b></span><span>Black <b>{headers.Black||"—"}</b></span><span>Event <b>{headers.Event||"—"}</b></span><span>Result <b>{headers.Result||"*"}</b></span></div>
    <label className="review-label">MOVE LIST · SELECT A MOVE TO JUMP</label>
    {moves.length===0?<div className="empty-state"><div className="empty-icon">♞</div><b>No game loaded</b><span>Paste a PGN below to start reviewing.</span></div>:<div className="review-moves">{Array.from({length:Math.ceil(moves.length/2)},(_,i)=><div className="review-move-row" key={i}><span>{i+1}.</span><button className={index===i*2+1?"chosen":""} onClick={()=>setIndex(i*2+1)}>{moves[i*2].san}</button>{moves[i*2+1]&&<button className={index===i*2+2?"chosen":""} onClick={()=>setIndex(i*2+2)}>{moves[i*2+1].san}</button>}</div>)}</div>}
   </section>
  </div>
  <section className="panel review-import"><div className="panel-head"><div><div className="eyebrow">PGN INPUT</div><h2>Load a game</h2></div><span className="tag">CHESS.JS VALIDATION</span></div><textarea value={pgn} onChange={e=>setPgn(e.target.value)} placeholder={'[Event "Training game"]\n[White "Player"]\n[Black "Opponent"]\n\n1. c4 e5 2. Nc3 Nf6 *'}/>{error&&<p className={error.includes("copied")?"form-success":"form-error"}>{error}</p>}<button className="primary" onClick={load}>Load PGN for review</button></section>
  <p className="muted">This module replays legal PGN moves and exposes the position FEN. It does not yet provide engine evaluations, best-move suggestions, or accuracy scores.</p>
 </>;
}
