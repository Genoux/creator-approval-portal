import Embed from "react-embed";

interface MediaEmbedProps {
  url: string;
  className?: string;
}

export function MediaEmbed({ url, className = "" }: MediaEmbedProps) {
  return (
    <div className={className}>
      <Embed url={url} />
    </div>
  );
}
