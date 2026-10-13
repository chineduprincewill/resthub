import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "./ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover"
import { useContext, useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { AppContext } from "../context/AppContext"
import { fetchOptions } from "../utils/resthubfunction"
import { generateYears } from "../utils/functions"


const ComboboxComponentSm = ({ data, handleInputChange, value = "" }) => {

    const { token } = useContext(AppContext)
    const [open, setOpen] = useState(false)
    const [comboOptions, setComboOptions] = useState()
    const [error, setError] = useState()
    const [fetching, setFetching] = useState(false)

    useEffect(() => {
      data.forms_type_options === 'years'
        ? setComboOptions(generateYears(2000, 2050))
        : fetchOptions(token, data.forms_type_options, setComboOptions, setError, setFetching)
    }, [])

    const selectedTitle =
      comboOptions && comboOptions.find((cmb) => cmb.title === value)?.title

    return (
      comboOptions &&
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full flex items-center justify-between h-10 bg-input border-border focus:ring-2 focus:ring-primary/30 focus:border-primary transition rounded-none"
          >
            {selectedTitle ? selectedTitle : `Search ${data.forms_text}`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandEmpty className="flex items-center justify-between p-4">
                <span>No record found.</span>
            </CommandEmpty>
            <CommandList>
              <CommandGroup>
                {comboOptions.map((cmb) => (
                  <CommandItem
                    key={cmb.title}
                    value={cmb.title}
                    onSelect={(currentValue) => {
                      const next = currentValue === value ? "" : currentValue
                      handleInputChange(data, data.forms_text, next)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === cmb.title ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="w-full flex gap-16 md:gap-48 justify-between items-center">
                      <span className="font-extralight">
                        {cmb.title.replaceAll('_', ' ')}
                      </span>
                      <span>.</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }

export default ComboboxComponentSm