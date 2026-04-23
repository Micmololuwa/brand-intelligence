import {
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Globe,
  MessageCircle,
  Music,
} from 'lucide-react'

const MAP = {
  Twitter:   { cls: 'twitter',   Icon: Twitter },
  Instagram: { cls: 'instagram', Icon: Instagram },
  LinkedIn:  { cls: 'linkedin',  Icon: Linkedin },
  Reddit:    { cls: 'reddit',    Icon: MessageCircle },
  YouTube:   { cls: 'youtube',   Icon: Youtube },
  Web:       { cls: 'web',       Icon: Globe },
  TikTok:    { cls: 'tiktok',    Icon: Music },
}

export default function PlatformBadge({ platform }) {
  const { cls, Icon } = MAP[platform] ?? { cls: 'web', Icon: Globe }
  return (
    <span className={`platform-badge ${cls}`}>
      <Icon size={10} strokeWidth={2.5} />
      {platform}
    </span>
  )
}
