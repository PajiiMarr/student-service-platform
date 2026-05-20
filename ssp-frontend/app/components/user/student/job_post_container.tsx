import React from "react";
import { Link } from "react-router";
import { useState } from "react";
import type { FetcherWithComponents } from "react-router";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { Button } from "~/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "~/components/ui/field";
import { Textarea } from "~/components/ui/textarea";
import { Input } from "~/components/ui/input";
import { useIsMobile } from "~/hooks/use-mobile";

interface JobPostContainerProps {
  fetcher: FetcherWithComponents<any>;
}

interface FormErrors {
  title?: string;
  description?: string;
  amount_offer?: string;
}

interface FormContentProps {
  errors: FormErrors;
  isSubmitting: boolean;
  isMobile: boolean;
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

function FormContent({
  errors,
  isSubmitting,
  isMobile,
  setErrors,
  handleSubmit,
}: FormContentProps) {
  return (
    <form onSubmit={handleSubmit} id="job-post-form" className="space-y-4 py-4">
      <FieldGroup>
        <FieldSet>
          <Field>
            <FieldLabel htmlFor="title">Job Title</FieldLabel>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Web Developer, Designer, Tutor"
              disabled={isSubmitting}
              aria-invalid={!!errors.title}
              onChange={() =>
                errors.title &&
                setErrors((prev) => ({ ...prev, title: undefined }))
              }
            />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">{errors.title}</p>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the job responsibilities, requirements, and expectations..."
              className="resize-none min-h-[100px]"
              disabled={isSubmitting}
              aria-invalid={!!errors.description}
              onChange={() =>
                errors.description &&
                setErrors((prev) => ({ ...prev, description: undefined }))
              }
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description}</p>
            )}
          </Field>
          <div>
            <Field>
              <FieldLabel htmlFor="amount_offer">Amount Offer (₱)</FieldLabel>
              <Input
                id="amount_offer"
                name="amount_offer"
                type="number"
                step="0.01"
                placeholder="e.g., 500.00"
                disabled={isSubmitting}
                aria-invalid={!!errors.amount_offer}
                onChange={() =>
                  errors.amount_offer &&
                  setErrors((prev) => ({ ...prev, amount_offer: undefined }))
                }
              />
              {errors.amount_offer && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.amount_offer}
                </p>
              )}
            </Field>
          </div>
        </FieldSet>
      </FieldGroup>
      <AlertDialogFooter>
        {isMobile ? (
          <DrawerClose asChild>
            <Button type="button" variant="outline" disabled={isSubmitting}>
              Cancel
            </Button>
          </DrawerClose>
        ) : (
          <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
        )}
        <Button
          type="submit"
          className="bg-red-700 hover:bg-red-800"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Job Post"}
        </Button>
      </AlertDialogFooter>
    </form>
  );
}

export default function JobPostContainer({ fetcher }: JobPostContainerProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const isSubmitting = fetcher.state === "submitting";
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (formData: FormData): boolean => {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const amountOffer = formData.get("amount_offer") as string;
    const newErrors: FormErrors = {};

    if (!title?.trim()) newErrors.title = "Job title is required";
    else if (title.trim().length < 3)
      newErrors.title = "Job title must be at least 3 characters";
    else if (title.trim().length > 100)
      newErrors.title = "Job title must not exceed 100 characters";

    if (!description?.trim())
      newErrors.description = "Job description is required";
    else if (description.trim().length < 10)
      newErrors.description = "Description must be at least 10 characters";
    else if (description.trim().length > 2000)
      newErrors.description = "Description must not exceed 2000 characters";

    if (!amountOffer?.trim())
      newErrors.amount_offer = "Amount offer is required";
    else {
      const amount = parseFloat(amountOffer);
      if (isNaN(amount)) newErrors.amount_offer = "Amount must be a valid number";
      else if (amount <= 0)
        newErrors.amount_offer = "Amount must be greater than 0";
      else if (amount > 1000000)
        newErrors.amount_offer = "Amount cannot exceed 1,000,000";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    if (!validateForm(formData)) {
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        document
          .getElementById(firstErrorField)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
        document.getElementById(firstErrorField)?.focus();
      }
      return;
    }

    fetcher.submit(formData, { method: "post" });
  };

  // Reset form only after successful submission
  React.useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.success) {
      setOpen(false);
      const form = document.getElementById("job-post-form") as HTMLFormElement;
      if (form) form.reset();
      setErrors({});
    }
  }, [fetcher.state, fetcher.data]);

  const formProps = { errors, isSubmitting, isMobile, setErrors, handleSubmit };

  return (
    <div className="w-full lg:w-[50%] h-full flex justify-evenly items-center gap-4 bg-gray-100 p-2 py-5 rounded-lg">
      <Link to="/student/profile" className="h-full">
        <Avatar className="h-12 w-12 cursor-pointer rounded-lg hover:bg-gray-100 transition-colors">
          <AvatarImage
            src="https://github.com/shadcn.png"
            alt="@shadcn"
            className="grayscale"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </Link>

      {isMobile ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              className="rounded-lg border h-10 w-[80%] lg:w-[90%]"
            >
              Create job post...
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[90vh]">
            <DrawerHeader>
              <DrawerTitle>Create Job Post</DrawerTitle>
              <DrawerDescription>
                Fill in the details below to create a new job posting.
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4 overflow-y-auto flex-1">
              <FormContent {...formProps} />
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="rounded-lg border h-10 w-[80%] lg:w-[90%]"
            >
              Create job post...
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="w-[90vw] max-w-[90vw] lg:max-w-[80vw] xl:max-w-[70vw] 2xl:max-w-[60vw]">
            <AlertDialogHeader>
              <AlertDialogTitle>Create Job Post</AlertDialogTitle>
              <AlertDialogDescription>
                Fill in the details below to create a new job posting.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <FormContent {...formProps} />
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}