import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  isLoading?: boolean;
  loadingText?: string;
  confirmText?: string;
  cancelText?: string;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Document",
  description = "Are you sure you want to delete this document? This action cannot be undone.",
  isLoading = false,
  loadingText = "Deleting...",
  confirmText = "Delete",
  cancelText = "Cancel"
}: DeleteModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <button
            className="cursor-pointer px-4 py-2 rounded bg-gray-600 text-white border border-gray-200 font-semibold transition-all duration-300 hover:bg-transparent hover:text-gray-600"
            onClick={onClose}
            type="button"
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            className="cursor-pointer px-4 py-2 rounded text-red-600 border border-red-600 hover:text-white hover:bg-red-700 font-semibold flex items-center justify-center min-w-[90px] transition-all duration-300"
            onClick={onConfirm}
            type="button"
            disabled={isLoading}
          >
            {isLoading && (
              <span className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin inline-block"></span>
            )}
            {isLoading ? loadingText : confirmText}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 