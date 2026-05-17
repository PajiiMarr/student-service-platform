import React from "react";
import { Link } from "react-router";
import { useState } from "react";
import { useFetcher } from "react-router";
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
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { Button } from "~/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "~/components/ui/field"
import { Checkbox } from "~/components/ui/checkbox"
import { Textarea } from "~/components/ui/textarea"
import { Input } from "~/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useIsMobile } from "~/hooks/use-mobile";
import { toast } from "sonner";

export default function JobPostContainer() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  // Handle submission response
  React.useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.success) {
        toast.success(fetcher.data.message || "Job post created successfully!", {
          description: "Your job posting has been published.",
          duration: 4000,
        });
        setOpen(false);
        // Reset form if needed
        const form = document.getElementById("job-post-form") as HTMLFormElement;
        if (form) form.reset();
      } else if (fetcher.data.error) {
        toast.error(fetcher.data.error, {
          description: "Please check your input and try again.",
          duration: 5000,
        });
      }
    }
  }, [fetcher.state, fetcher.data]);

  const FormContent = () => (
    <fetcher.Form 
      method="post" 
      id="job-post-form"
      className="space-y-4 py-4"
    >
      <FieldGroup>
        <FieldSet>
          <Field>
            <FieldLabel htmlFor="job-title">Job Title</FieldLabel>
            <Input
              id="job-title"
              name="job-title"
              placeholder="e.g., Web Developer, Designer, Tutor"
              required
              disabled={isSubmitting}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="job-description">Description</FieldLabel>
            <Textarea
              id="job-description"
              name="job-description"
              placeholder="Describe the job responsibilities, requirements, and expectations..."
              className="resize-none min-h-[100px]"
              required
              disabled={isSubmitting}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="job-amount">
                Amount Offer (₱)
              </FieldLabel>
              <Input
                id="job-amount"
                name="job-amount"
                type="number"
                step="0.01"
                placeholder="e.g., 500.00"
                required
                disabled={isSubmitting}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="job-status">Status</FieldLabel>
              <Select name="job-status" defaultValue="open" disabled={isSubmitting}>
                <SelectTrigger id="job-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">
                      In Progress
                    </SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field orientation="horizontal">
            <Checkbox 
              id="job-terms" 
              name="job-terms"
              required 
              disabled={isSubmitting}
            />
            <FieldLabel htmlFor="job-terms" className="font-normal">
              I confirm that this job posting follows the platform
              guidelines
            </FieldLabel>
          </Field>
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
    </fetcher.Form>
  );

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
              <FormContent />
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
            <FormContent />
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}