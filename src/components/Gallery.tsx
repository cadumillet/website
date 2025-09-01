type Props = {
  images: string[];
  columns?: number;
  padding?: string | number;
  fullWidth?: boolean;
};

export default function Gallery({
  images,
  columns = 3,
  padding,
  fullWidth,
}: Props) {
  if (images.length === 1) {
    return (
      <div
        style={{
          paddingInline: fullWidth ? undefined : padding,
          marginBottom: "var(--content-spacing, 1.5rem)",
        }}
      >
        <img src={images[0]} className="w-full" alt="" />
      </div>
    );
  }

  return (
    <div
      className="grid gap-1 items-stretch"
      style={{
        paddingInline: fullWidth ? undefined : padding,
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        marginBottom: "var(--content-spacing, 1.5rem)",
      }}
    >
      {images.map((src, i) => (
        <div
          key={i}
          className="relative w-full h-full aspect-[4/3] overflow-hidden"
        >
          <img
            src={src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
