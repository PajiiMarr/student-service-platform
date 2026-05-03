"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { formatFormErrors } from "~/utils/handler/error-handler";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function ProfilingForm({
  fetcher,
  collegesData = [],
}: {
  fetcher: any;
  collegesData?: any[];
}) {
  const errors = fetcher.data?.errors;
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [age, setAge] = useState<number | null>(null);
  const [currentStage, setCurrentStage] = useState(1);
  const [selectedCollege, setSelectedCollege] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);

  // Stage 1 field values (controlled so we can validate before moving to stage 2)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [street, setStreet] = useState("");
  const [barangay, setBarangay] = useState("");
  const city = "City of Zamboanga";

  const calculateAge = (birth: Date): number => {
    const today = new Date();
    let calculatedAge = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      calculatedAge--;
    }
    return calculatedAge;
  };

  const handleDateSelect = (selected: Date | undefined) => {
    setDate(selected);
    setOpen(false);
    setAge(selected ? calculateAge(selected) : null);
  };

  const birthdayValue = date
    ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    : "";

  // Sync server-side errors and jump back to stage 1 if stage 1 fields have errors
  useEffect(() => {
    if (errors) {
      const formatted = formatFormErrors(errors);
      setFieldErrors(formatted);

      const stage1Fields = [
        "first_name",
        "last_name",
        "birthday",
        "street",
        "barangay",
        "age",
      ];
      const hasStage1Error = stage1Fields.some((f) => formatted[f]);
      if (hasStage1Error) {
        setCurrentStage(1);
      }
    }
  }, [errors]);

  const handleCollegeChange = (value: string) => {
    setSelectedCollege(value);
    setSelectedCourse("");
    const college = collegesData.find((c: any) => c.ID.toString() === value);
    setAvailableCourses(college?.Courses || []);
  };

  // Client-side validation for stage 1 before advancing
  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // ← add this

    const newErrors: Record<string, string> = {};
    if (!firstName.trim()) newErrors.first_name = "First Name is required!";
    if (!lastName.trim()) newErrors.last_name = "Last Name is required!";
    if (!birthdayValue) newErrors.birthday = "Birthday is required!";
    if (!street.trim()) newErrors.street = "Street is required!";
    if (!barangay.trim()) newErrors.barangay = "Barangay is required!";
    if (age !== null && age < 18)
      newErrors.age = "You must be at least 18 years old!";
    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      return;
    }
    setFieldErrors({});
    setCurrentStage(2);
  };

  const handleBack = () => {
    setCurrentStage(1);
  };

  return (
    <div className="flex justify-center w-full h-full">
      <fetcher.Form
        method="put"
        className="p-7 rounded-lg flex flex-col justify-between w-full lg:w-1/3"
      >
        {/*
          IMPORTANT: Stage 1 fields are always rendered in the DOM so their values
          are included in the form submission regardless of which stage is visible.
          We toggle visibility with CSS classes instead of conditional rendering.
        */}

        <div>
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    currentStage >= 1
                      ? "bg-red-700 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  1
                </div>
                <span
                  className={`text-sm mt-2 ${
                    currentStage >= 1
                      ? "text-red-700 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  Personal
                </span>
              </div>

              <div className="flex-1 h-0.5 mx-2 bg-gray-200 relative">
                <div
                  className={`absolute top-0 left-0 h-full transition-all duration-300 ${
                    currentStage >= 2 ? "w-full bg-red-700" : "w-0 bg-red-700"
                  }`}
                />
              </div>

              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    currentStage >= 2
                      ? "bg-red-700 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  2
                </div>
                <span
                  className={`text-sm mt-2 ${
                    currentStage >= 2
                      ? "text-red-700 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  Academic
                </span>
              </div>
            </div>
          </div>

          {/* Stage 1: Personal Information */}
          <div className={currentStage === 1 ? "block" : "hidden"}>
            {/* Progress Steps */}

            <div>
              <h2 className="text-2xl font-bold text-center">
                Welcome to SSP!
              </h2>
              <p className="text-center">
                Setup your account before we proceed.
              </p>
            </div>
            <h3 className="mb-2 mt-5">Personal Information</h3>

            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="col-span-2 md:col-span-1">
                <div className="flex">
                  <Label htmlFor="first_name" className="mb-2">
                    First Name<span className="text-red-500">*</span>
                  </Label>
                  {fieldErrors?.first_name && (
                    <p className="ms-2 mb-2 text-xs text-red-600 flex items-center">
                      {fieldErrors.first_name}
                    </p>
                  )}
                </div>
                <Input
                  id="first_name"
                  name="first_name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={
                    fieldErrors?.first_name ? "border-red-500 bg-red-50" : ""
                  }
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <div className="flex">
                  <Label htmlFor="last_name" className="mb-2">
                    Last Name<span className="text-red-500">*</span>
                  </Label>
                  {fieldErrors?.last_name && (
                    <p className="ms-2 mb-2 text-xs text-red-600 flex items-center">
                      {fieldErrors.last_name}
                    </p>
                  )}
                </div>
                <Input
                  id="last_name"
                  name="last_name"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={
                    fieldErrors?.last_name ? "border-red-500 bg-red-50" : ""
                  }
                />
              </div>
            </div>

            <div className="mb-2">
              <Label htmlFor="middle_name" className="mb-2">
                Middle Name
              </Label>
              <Input
                id="middle_name"
                name="middle_name"
                type="text"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
              />
            </div>

            <div className="mb-2 grid grid-cols-2 gap-2">
              <div className="col-span-2 md:col-span-1">
                <div className="flex">
                  <Label className="mb-2">
                    Birthday<span className="text-red-500">*</span>
                  </Label>
                  {fieldErrors?.birthday && (
                    <p className="ms-2 mb-2 text-xs text-red-600 flex items-center">
                      {fieldErrors.birthday}
                    </p>
                  )}
                </div>

                <input type="hidden" name="birthday" value={birthdayValue} />

                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      type="button"
                      className={`w-full justify-start font-normal ${
                        fieldErrors?.birthday ? "border-red-500 bg-red-50" : ""
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      {date ? (
                        date.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      ) : (
                        <span className="text-muted-foreground">
                          Select date
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={date}
                      defaultMonth={date}
                      captionLayout="dropdown"
                      onSelect={handleDateSelect}
                      disabled={(d) => d > new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="col-span-2 md:col-span-1">
                <div className="flex">
                  <Label htmlFor="age" className="mb-2">
                    Age
                  </Label>
                  {fieldErrors?.age && (
                    <p className="ms-2 mb-2 text-xs text-red-600 flex items-center">
                      {fieldErrors.age}
                    </p>
                  )}
                </div>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={age ?? ""}
                  disabled
                  readOnly
                />
              </div>
            </div>

            <h3 className="mb-2 mt-5">Address</h3>

            <div className="mb-2">
              <div className="flex">
                <Label htmlFor="street" className="mb-2">
                  Street<span className="text-red-500">*</span>
                </Label>
                {fieldErrors?.street && (
                  <p className="ms-2 mb-2 text-xs text-red-600 flex items-center">
                    {fieldErrors.street}
                  </p>
                )}
              </div>
              <Input
                id="street"
                name="street"
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className={
                  fieldErrors?.street ? "border-red-500 bg-red-50" : ""
                }
              />
            </div>

            <div className="mb-2">
              <div className="flex">
                <Label htmlFor="barangay" className="mb-2">
                  Barangay<span className="text-red-500">*</span>
                </Label>
                {fieldErrors?.barangay && (
                  <p className="ms-2 mb-2 text-xs text-red-600 flex items-center">
                    {fieldErrors.barangay}
                  </p>
                )}
              </div>
              <Input
                id="barangay"
                name="barangay"
                type="text"
                value={barangay}
                onChange={(e) => setBarangay(e.target.value)}
                className={
                  fieldErrors?.barangay ? "border-red-500 bg-red-50" : ""
                }
              />
            </div>

            <div className="mb-2">
              <Label htmlFor="city" className="mb-2">
                City
              </Label>
              <Input id="city" name="city" type="text" value={city} disabled />
            </div>
          </div>

          {/* Stage 2: Academic Information */}
          <div className={currentStage === 2 ? "block" : "hidden"}>
            <h3 className="mb-2 mt-5">Academic Information</h3>

            {/* College Dropdown */}
            <div className="mb-2">
              <div className="flex">
                <Label className="mb-2">
                  College<span className="text-red-500">*</span>
                </Label>
              </div>
              <Select
                name="college"
                onValueChange={handleCollegeChange}
                value={selectedCollege}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your college" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Colleges</SelectLabel>
                    {collegesData.map((college: any) => (
                      <SelectItem
                        key={college.ID}
                        value={college.ID.toString()}
                      >
                        {college.Name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Course Dropdown */}
            <div className="mb-2">
              <div className="flex">
                <Label className="mb-2">
                  Course/Program<span className="text-red-500">*</span>
                </Label>
              </div>
              <Select
                name="course"
                value={selectedCourse}
                onValueChange={setSelectedCourse}
                disabled={!selectedCollege}
              >
                <SelectTrigger
                  className={`w-full ${!selectedCollege ? "bg-gray-100" : ""}`}
                >
                  <SelectValue
                    placeholder={
                      !selectedCollege
                        ? "Select a college first"
                        : "Select your course"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Courses</SelectLabel>
                    {availableCourses.map((course: any) => (
                      <SelectItem key={course.ID} value={course.ID.toString()}>
                        {course.Name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Year Level Dropdown */}
            <div className="mb-2">
              <div className="flex">
                <Label className="mb-2">
                  Year Level<span className="text-red-500">*</span>
                </Label>
              </div>
              <Select name="year_level">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select year level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Year Level</SelectLabel>
                    <SelectItem value="1">1st Year</SelectItem>
                    <SelectItem value="2">2nd Year</SelectItem>
                    <SelectItem value="3">3rd Year</SelectItem>
                    <SelectItem value="4">4th Year</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Section */}
            <div className="mb-2">
              <Label htmlFor="section" className="mb-2">
                Section<span className="text-red-500">*</span>
              </Label>
              <Input
                id="section"
                name="section"
                type="text"
                placeholder="A, B, C, or 1, 2, 3"
              />
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-5">
          {currentStage === 2 && (
            <Button
              type="button"
              onClick={handleBack}
              variant="outline"
              className="flex-1"
            >
              Back
            </Button>
          )}

          {currentStage === 1 ? (
            <Button
              type="button"
              onClick={handleNext}
              className="flex-1 bg-red-700 hover:bg-red-800 text-white"
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              className="flex-1 bg-red-700 hover:bg-red-800 text-white"
              disabled={fetcher.state === "submitting"}
            >
              {fetcher.state === "submitting" ? "Submitting..." : "Submit"}
            </Button>
          )}
        </div>

        {/* General error */}
        {fieldErrors?.general && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm text-center flex items-center justify-center">
              {fieldErrors.general}
            </p>
          </div>
        )}
      </fetcher.Form>
    </div>
  );
}
