'use client'

import { MODELS } from '@/lib/models'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Props = {
  value: string
  onChange: (model: string) => void
}

export function ModelSelector({ value, onChange }: Props) {
  const providers = [...new Set(MODELS.map((m) => m.provider))]

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-48 h-8 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {providers.map((provider) => (
          <SelectGroup key={provider}>
            <SelectLabel className="text-xs text-muted-foreground">{provider}</SelectLabel>
            {MODELS.filter((m) => m.provider === provider).map((model) => (
              <SelectItem key={model.id} value={model.id} className="text-xs">
                {model.name}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  )
}
