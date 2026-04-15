export default function GlobeBackground() {
  return (
    <video
      disablePictureInPicture
      muted
      autoPlay
      loop
      playsInline
      preload="metadata"
      controls={false}
      className="absolute inset-0 mx-auto my-16 aspect-square size-auto mix-blend-exclusion dark:opacity-60 dark:mix-blend-plus-lighter"
    >
      <source src="background.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}