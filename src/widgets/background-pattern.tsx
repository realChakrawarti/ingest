export default function BackgroundPattern() {
  return (
    <div
      className="fixed inset-0 -z-10"
      style={{
        backgroundImage: "url(background-noise.png)",
        backgroundRepeat: "repeat",
        backgroundSize: "128px",
        borderRadius: "0px",
        height: "100%",
        opacity: "0.06",
        width: "100%",
      }}
    />
  );
}