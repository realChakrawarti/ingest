import type { ReactNode } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  type AlertDialogProps,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/shared/ui/alert-dialog";

import Spinner from "./spinner";

interface DeleteModalProps extends AlertDialogProps {
  children?: ReactNode | undefined;
  label: string | ReactNode;
  onDelete: () => void;
  isDeleting?: boolean;
}

export function DeleteModal({
  children,
  label,
  onDelete,
  isDeleting,
  ...rest
}: DeleteModalProps) {
  return (
    <AlertDialog {...rest}>
      <AlertDialogTrigger asChild aria-label="Delete confirmation dialog">
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>{label}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isDeleting} onClick={onDelete}>
            {isDeleting ? <Spinner label="Deleting..." /> : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
