"use client";

export default function InfoDetailSection() {
  return (
    <div id="infodetail" style={{ padding: "10vh 4rem 20vh" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8vw", maxWidth: "1000px" }}>
        {/* Left */}
        <div>
          <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.2rem,2.5vw,2rem)", fontWeight: 300, lineHeight: 1.4, marginBottom: "2rem", color: "#f0f0f0" }}>
            끝임없이 GO!하는<br />
            <strong style={{ fontWeight: 600 }}>디자이너 고평은</strong>입니다.
          </h2>
          <dl style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              ["Name", "PYEONGEUN KO"],
              ["Birth", "1993 / 10 / 4"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: "2.5rem" }}>
                <dt style={{ fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", width: "3.5rem", flexShrink: 0, paddingTop: "0.2rem" }}>
                  {k}
                </dt>
                <dd style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)" }}>{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Right */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          {[
            {
              title: "Education",
              items: ["정명정보고등학교 e-비즈니스과 졸업", "경인여자대학교 광고영상디자인과 졸업"],
            },
            {
              title: "Contacts",
              items: ["010.4173.2140", "rhvuddms1004@gmail.com"],
            },
          ].map(({ title, items }) => (
            <div key={title}>
              <h3 style={{ fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", marginBottom: "1rem" }}>{title}</h3>
              <ul style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {items.map((item) => (
                  <li key={item} style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.55)", listStyle: "none" }}>{item}</li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 style={{ fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", marginBottom: "1rem" }}>Experience</h3>
            <ul style={{ display: "flex", flexDirection: "column", gap: "1rem", listStyle: "none" }}>
              {[
                ["경인여대 광고영상디자인과", "총무과대표 1년"],
                ["딤커뮤니케이션", "코카콜라 SNS 콘텐츠 이미지제작, 영상편집"],
                ["스티밍", "브랜드 콘텐츠 이미지제작, 홈페이지 구축 디자인"],
                ["디엠성형외과", "병원 내 인쇄물 제작, 웹디자인, 영상편집"],
                ["이노브모바일", "롯데백화점 웹디자인, 영상편집"],
                ["스핀즈&위고", "캐릭터 디자인 의류 콜라보 제작"],
                ["크리센트", "브랜드 콘텐츠 이미지 제작"],
                ["헤이즐로드", "브랜딩 기획 및 온/오프라인 디자인"],
              ].map(([co, desc]) => (
                <li key={co}>
                  <p style={{ fontSize: "0.8rem", fontWeight: 500, color: "rgba(255,255,255,0.72)" }}>{co}</p>
                  <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", marginTop: "0.2rem" }}>{desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
