const blurLayers = [
  {
    zIndex: 1,
    blur: 0.078125,
    mask: "linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 12.5%, rgba(0, 0, 0, 1) 25%, rgba(0, 0, 0, 0) 37.5%)",
  },
  {
    zIndex: 2,
    blur: 0.15625,
    mask: "linear-gradient(to bottom, rgba(0, 0, 0, 0) 12.5%, rgba(0, 0, 0, 1) 25%, rgba(0, 0, 0, 1) 37.5%, rgba(0, 0, 0, 0) 50%)",
  },
  {
    zIndex: 3,
    blur: 0.3125,
    mask: "linear-gradient(to bottom, rgba(0, 0, 0, 0) 25%, rgba(0, 0, 0, 1) 37.5%, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0) 62.5%)",
  },
  {
    zIndex: 4,
    blur: 0.625,
    mask: "linear-gradient(to bottom, rgba(0, 0, 0, 0) 37.5%, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 1) 62.5%, rgba(0, 0, 0, 0) 75%)",
  },
  {
    zIndex: 5,
    blur: 1.25,
    mask: "linear-gradient(to bottom, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 1) 62.5%, rgba(0, 0, 0, 1) 75%, rgba(0, 0, 0, 0) 87.5%)",
  },
  {
    zIndex: 6,
    blur: 2.5,
    mask: "linear-gradient(to bottom, rgba(0, 0, 0, 0) 62.5%, rgba(0, 0, 0, 1) 75%, rgba(0, 0, 0, 1) 87.5%, rgba(0, 0, 0, 0) 100%)",
  },
  {
    zIndex: 7,
    blur: 5,
    mask: "linear-gradient(to bottom, rgba(0, 0, 0, 0) 75%, rgba(0, 0, 0, 1) 87.5%, rgba(0, 0, 0, 1) 100%)",
  },
  {
    zIndex: 8,
    blur: 10,
    mask: "linear-gradient(to bottom, rgba(0, 0, 0, 0) 87.5%, rgba(0, 0, 0, 1) 100%, rgba(0, 0, 0, 1) 100%)",
  },
];

export default function FooterBlur() {
  return (
    <div className="pointer-events-none fixed right-0 bottom-0 left-0 h-36 w-full">
      <div className="pointer-events-none absolute inset-0">
        {blurLayers.map(({ zIndex, blur, mask }) => (
          <div
            key={zIndex}
            className="pointer-events-none absolute inset-0"
            style={{
              zIndex,
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        ))}
      </div>
    </div>
  );
}