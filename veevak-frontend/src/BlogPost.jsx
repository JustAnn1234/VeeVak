import blogPosts from "./data/blogPosts.json";

export default function BlogPost({ slug }) {
  const post = blogPosts.find(item => item.slug === slug);

  if (!post) {
    return <main style={pageStyle}><a href="/?landing=1" style={backStyle}>← Back to Home</a><h1 style={titleStyle}>Article not found</h1></main>;
  }

  return (
    <main style={pageStyle}>
      <a href="/?landing=1" style={backStyle}>← Back to Home</a>
      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",marginBottom:16}}>
        <span style={pillStyle}>{post.category}</span><span style={mutedStyle}>{post.readTime} · {post.date}</span>
      </div>
      <h1 style={titleStyle}>{post.title}</h1>
      <p style={subtitleStyle}>{post.subtitle}</p>
      <div style={{display:"flex",alignItems:"center",gap:10,borderBottom:"1px solid #2e2e50",paddingBottom:24,marginBottom:28}}>
        <div style={authorStyle}>{post.author[0]}</div><div><div style={{fontSize:13,color:"#e8e6ff",fontWeight:600}}>{post.author}</div><div style={mutedStyle}>VeeVak Research & Engineering</div></div>
      </div>
      <div style={{aspectRatio:"16 / 9",borderRadius:14,overflow:"hidden",border:"1px solid #2e2e50",marginBottom:36,background:"#1e1e34"}}><img src={post.image} alt={post.title} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} /></div>
      <article style={{color:"#c8c6dc",fontSize:16,lineHeight:1.8}}>
        {post.content.map((section, index) => {
          if (section.type === "heading") return <h2 key={index} style={headingStyle}>{section.text}</h2>;
          if (section.type === "bulletList") return <ul key={index} style={{paddingLeft:24,margin:"0 0 22px"}}>{section.items.map((item, itemIndex) => <li key={itemIndex} style={{marginBottom:8}}>{item}</li>)}</ul>;
          return <p key={index} style={{margin:"0 0 22px"}}>{section.text}</p>;
        })}
      </article>
      <section style={ctaStyle}><h2 style={{margin:"0 0 8px",color:"#e8e6ff",fontSize:24}}>Ready to automate your social commerce sales?</h2><p style={{margin:"0 0 20px",color:"#9898b8",fontSize:13}}>Stop losing money to unlogged chats. Track sales, stock, and revenue automatically.</p><a href="/?auth=signup" target="_blank" rel="noopener noreferrer" style={ctaButtonStyle}>Get Started with VeeVak Free →</a></section>
    </main>
  );
}

const pageStyle = {minHeight:"100vh",background:"#11111f",color:"#e8e6ff",padding:"56px max(24px, calc((100vw - 860px) / 2)) 80px",fontFamily:"Inter, sans-serif"};
const backStyle = {display:"inline-block",color:"#c4bcff",textDecoration:"none",fontSize:13,marginBottom:28};
const pillStyle = {padding:"5px 10px",borderRadius:20,background:"#312c6e",color:"#c4bcff",fontSize:11,fontWeight:700};
const mutedStyle = {color:"#767699",fontSize:12};
const titleStyle = {fontFamily:"Space Grotesk, sans-serif",fontSize:"clamp(30px, 5vw, 54px)",lineHeight:1.08,margin:"0 0 16px",color:"#f0efff"};
const subtitleStyle = {fontSize:"clamp(16px, 2vw, 20px)",lineHeight:1.65,color:"#9898b8",margin:"0 0 24px"};
const authorStyle = {width:38,height:38,borderRadius:"50%",background:"#312c6e",color:"#c4bcff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700};
const headingStyle = {fontFamily:"Space Grotesk, sans-serif",fontSize:26,lineHeight:1.25,color:"#f0efff",margin:"38px 0 12px"};
const ctaStyle = {marginTop:48,padding:"28px",textAlign:"center",borderRadius:14,background:"linear-gradient(135deg,#25205f,#181828)",border:"1px solid #41378d"};
const ctaButtonStyle = {display:"inline-block",padding:"12px 20px",borderRadius:9,background:"#8b7ff5",color:"#11111f",fontSize:13,fontWeight:700,textDecoration:"none"};
