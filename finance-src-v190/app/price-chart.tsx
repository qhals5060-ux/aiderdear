'use client';
import {useState} from 'react';
import {Asset,money,priceLabel} from './data';
export function PriceChart({asset,compact=false}:{asset:Asset;compact?:boolean}){
 const [range,setRange]=useState('all'),[point,setPoint]=useState<number|null>(null);
 const series=asset.series.length>1?asset.series.map(v=>v/asset.series[asset.series.length-1]*asset.price):[];
 const values=range==='recent'?series.slice(-5):series;
 if(!values.length)return <div className="price-chart-empty">가격 이력 없음 <span>직접 입력한 자산</span></div>;
 const min=Math.min(...values),max=Math.max(...values),padding=Math.max((max-min)*.18,asset.price*.005),bottom=min-padding,top=max+padding;
 const w=720,h=compact?145:174,x=(i:number)=>i/(values.length-1)*w,y=(v:number)=>h-(v-bottom)/(top-bottom)*h;
 const path=values.map((v,i)=>`${i?'L':'M'}${x(i).toFixed(2)},${y(v).toFixed(2)}`).join(' '),idx=point===null?values.length-1:Math.min(point,values.length-1),diff=values[values.length-1]/values[0]*100-100;
 const fmt=(v:number)=>money({...asset,price:asset.currency==='KRW'&&['stock','etf'].includes(asset.kind)?Math.round(v):Math.round(v*100)/100});
 return <section className={`price-chart ${compact?'compact':''}`} aria-label={`${asset.name} 예시 가격 추이`}>
 <div className="price-chart-header"><div><span className="chart-value-label">{point===null?priceLabel(asset):`시점 ${idx+1}`}</span><strong>{fmt(values[idx])}</strong><span className={diff>=0?'chart-gain':'chart-loss'}>구간 {diff>=0?'+':''}{diff.toFixed(1)}%</span></div><div className="chart-range" aria-label="차트 구간"><button aria-pressed={range==='all'} onClick={()=>{setRange('all');setPoint(null)}}>전체</button><button aria-pressed={range==='recent'} onClick={()=>{setRange('recent');setPoint(null)}}>최근 5개</button></div></div>
 <div className="price-plot-wrap"><div className="price-axis">{[top,(top+bottom)/2,bottom].map((v,i)=><span key={i}>{fmt(v)}</span>)}</div><div className="price-plot"><svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" role="img" aria-label={`구간 시작 ${fmt(values[0])}, 최저 ${fmt(min)}, 최고 ${fmt(max)}, 마지막 ${fmt(values[values.length-1])}. 예시 가격.`} onPointerMove={e=>{const rect=e.currentTarget.getBoundingClientRect();setPoint(Math.max(0,Math.min(values.length-1,Math.round((e.clientX-rect.left)/rect.width*(values.length-1)))))}} onPointerLeave={()=>setPoint(null)}>
 {[0,h/2,h].map((yy,i)=><line key={i} x1="0" y1={yy} x2={w} y2={yy} stroke="#dee6e3" strokeDasharray={i===1?'4 4':undefined}/>)}
 <path d={`${path} L${w},${h} L0,${h} Z`} fill="#335d5b" opacity=".07"/>
 <path d={path} fill="none" stroke="#335d5b" strokeWidth="2.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke"/>
 {point!==null&&<line x1={x(idx)} x2={x(idx)} y1="0" y2={h} stroke="#819d95" strokeDasharray="3 4"/>}<circle cx={x(idx)} cy={y(values[idx])} r="4" fill="#335d5b" stroke="white" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
 </svg><div className="price-time-axis"><span>구간 시작</span><span>구간 마지막</span></div></div></div>
 <div className="price-chart-foot"><span>최저 {fmt(min)} <i/> 최고 {fmt(max)}</span><span>예시 가격 · 실제 거래일 미반영</span></div>
 </section>;
}
