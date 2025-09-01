"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import EditProfileForm from "./EditProfileForm";

export default function EditProfileDialog({
  open,
  onOpenChange,
  allowClose = true,
}: {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  allowClose?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={allowClose ? onOpenChange : () => {}}>
      <DialogContent className="w-full max-w-2xl max-h-screen overflow-y-auto" showCloseButton={allowClose}>
        <DialogHeader>
          <DialogTitle>Edit Your Profile</DialogTitle>
        </DialogHeader>
        <EditProfileForm onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
