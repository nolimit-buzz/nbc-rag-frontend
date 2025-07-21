"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  profilePicture?: string
}

interface MultiSelectProps {
  query: string
  setQuery: (query: string) => void
  users: User[]
  selectedUsers: User[]
  onSelectionChange: (users: User[]) => void
  placeholder?: string
  loading?: boolean
  className?: string
}

export function MultiSelect({
  query,
  setQuery,
  users,
  selectedUsers,
  onSelectionChange,
  placeholder = "Select users...",
  loading = false,
  className,
}: MultiSelectProps) {

  const [open, setOpen] = React.useState(false);

  const handleUnselect = (userToRemove: User) => {
    onSelectionChange(selectedUsers.filter((user) => user._id !== userToRemove._id))
  }

  const handleSelect = (user: User) => {
    const isAlreadySelected = selectedUsers.some((selectedUser) => selectedUser._id === user._id)
    if (!isAlreadySelected) {
      onSelectionChange([...selectedUsers, user])
    }
    setQuery("")
    setOpen(false); // Close popover after selection
  }

  const filteredUsers = users.filter((user) => {
    const isAlreadySelected = selectedUsers.some((selectedUser) => selectedUser._id === user._id)
    return !isAlreadySelected
  })

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex flex-wrap gap-1 items-center cursor-pointer",
            className
          )}
          tabIndex={0}
          onClick={() => setOpen(true)}
        >
          {selectedUsers.length > 0 ? (
            selectedUsers.map((user) => (
              <Badge
                key={user._id}
                variant="secondary"
                className="rounded-sm px-1 font-normal"
              >
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-xs font-medium text-white">
                    {user.profilePicture ? (
                      <Image
                        src={user.profilePicture}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-4 h-4 rounded-full object-cover"
                        width={16}
                        height={16}
                      />
                    ) : (
                      `${user.firstName[0]}${user.lastName[0]}`
                    )}
                  </div>
                  <span className="text-xs">
                    {user.firstName} {user.lastName}
                  </span>
                  <button
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnselect(user)
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnselect(user);
                    }}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <input
          autoFocus
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent outline-none px-3 py-2 text-sm placeholder:text-muted-foreground border-b border-input mb-2"
        />
        <Command>
          <CommandGroup className="max-h-60 overflow-auto">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-sm text-muted-foreground">Loading users...</span>
              </div>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <CommandItem
                  key={user._id}
                  onSelect={() => handleSelect(user)}
                  className="flex items-center gap-2"
                >
                  <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-xs font-medium text-white">
                    {user.profilePicture ? (
                      <Image
                        src={user.profilePicture}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-6 h-6 rounded-full object-cover"
                        width={24}
                        height={24}
                      />
                    ) : (
                      `${user.firstName[0]}${user.lastName[0]}`
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {user.firstName} {user.lastName}
                      {user._id === localStorage.getItem('userId') && ' (You)'}
                    </div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </div>
                </CommandItem>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-muted-foreground">
                {query ? 'No users found matching your search.' : 'Start typing to search for users.'}
              </div>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 