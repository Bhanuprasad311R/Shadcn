'use client'

import { useState } from 'react'
import { IconAlertTriangle } from '@tabler/icons-react'
import { showSubmittedData } from '@/utils/show-submitted-data'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { User } from '../data/schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: User
}

export function UsersDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const [value, setValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleDelete = async () => {
    if (value.trim() !== currentRow.username) return

    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      // Make API call to delete the user
      const response = await fetch(`http://localhost:4000/users/delete/${currentRow.username}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Something went wrong')
      }

      // On success, close dialog and show success message
      setSuccessMessage(`The following user has been deleted: ${currentRow.username}`)
      onOpenChange(false)

      // Optionally, log or display the submitted data
      showSubmittedData(currentRow, 'The following user has been deleted:')
    } catch (err) {
      setError((err as Error).message || 'Failed to delete user')
    } finally {
      setIsLoading(false)
    }
  }

  // Disable delete button if username doesn't match or it's in the loading state
  const isDeleteDisabled = value.trim() !== currentRow.username || isLoading

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={isDeleteDisabled} // Ensure the button is disabled properly
      title={
        <span className='text-destructive'>
          <IconAlertTriangle
            className='stroke-destructive mr-1 inline-block'
            size={18}
          />{' '}
          Delete User
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete{' '}
            <span className='font-bold'>{currentRow.username}</span>?
            <br />
            This action will permanently remove the user with the role of{' '}
            <span className='font-bold'>
              {currentRow.role.toUpperCase()}
            </span>{' '}
            from the system. This cannot be undone.
          </p>

          <Label className='my-2'>
            Username:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Enter username to confirm deletion.'
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation cannot be undone.
            </AlertDescription>
          </Alert>

          {successMessage && (
            <Alert variant='default'> {/* Keep 'default' for success */}
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant='destructive'>
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      }
      confirmText={isLoading ? 'Deleting...' : 'Delete'}
      destructive
    />
  )
}
