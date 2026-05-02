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

export default function ProfilingForm({ fetcher }: { fetcher: any }) {
  const errors = fetcher.data?.errors;
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [age, setAge] = useState<number | null>(null);
  const [currentStage, setCurrentStage] = useState(1); // 1 = Personal, 2 = Academic
  const city = "City of Zamboanga";

  const calculateAge = (birth: Date): number => {
    const today = new Date();
    let calculatedAge = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      calculatedAge--;
    }
    return calculatedAge;
  };

  const handleDateSelect = (selected: Date | undefined) => {
    setDate(selected);
    setOpen(false);
    setAge(selected ? calculateAge(selected) : null);
  };

  // Format Date to YYYY-MM-DD for the hidden input
  const birthdayValue = date
    ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    : "";

  useEffect(() => {
    if (errors) {
      setFieldErrors(formatFormErrors(errors));
    }
  }, [errors]);

  const handleNext = () => {
    setCurrentStage(2);
  };

  const handleBack = () => {
    setCurrentStage(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    // Let the fetcher.Form handle submission
    // This is just to prevent double submission
  };

  return (
    <div className="flex justify-center items-center w-full h-full">
      <fetcher.Form
        method="put"
        className="p-7 rounded-lg lg:shadow-lg w-full lg:w-1/3"
      >
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {/* Stage 1 */}
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
                  currentStage >= 1 ? "text-red-700 font-medium" : "text-gray-500"
                }`}
              >
                Personal
              </span>
            </div>

            {/* Connector Line */}
            <div className="flex-1 h-0.5 mx-2 bg-gray-200 relative">
              <div
                className={`absolute top-0 left-0 h-full transition-all duration-300 ${
                  currentStage >= 2 ? "w-full bg-red-700" : "w-0 bg-red-700"
                }`}
              />
            </div>

            {/* Stage 2 */}
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
                  currentStage >= 2 ? "text-red-700 font-medium" : "text-gray-500"
                }`}
              >
                Academic
              </span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center">Welcome to SSP!</h2>
        <p className="text-center">Setup your account before we proceed.</p>

        {/* Stage 1: Personal Information */}
        {currentStage === 1 && (
          <>
            <h3 className="mb-2 mt-5">Personal Information</h3>

            {/* First Name & Last Name */}
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
                  className={fieldErrors?.first_name ? "border-red-500 bg-red-50" : ""}
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
                  className={fieldErrors?.last_name ? "border-red-500 bg-red-50" : ""}
                />
              </div>
            </div>

            {/* Middle Name */}
            <div className="mb-2">
              <Label htmlFor="middle_name" className="mb-2">
                Middle Name
              </Label>
              <Input id="middle_name" name="middle_name" type="text" />
            </div>

            {/* Birthday & Age */}
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

                {/* Hidden input so birthday is submitted with the form */}
                <input type="hidden" name="birthday" value={birthdayValue} />

                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start font-normal ${
                        fieldErrors?.birthday ? "border-red-500 bg-red-50" : ""
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      {date ? date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : (
                        <span className="text-muted-foreground">Select date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
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

            {/* Street */}
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
                className={fieldErrors?.street ? "border-red-500 bg-red-50" : ""}
              />
            </div>

            {/* Barangay */}
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
                className={fieldErrors?.barangay ? "border-red-500 bg-red-50" : ""}
              />
            </div>

            {/* City */}
            <div className="mb-2">
              <Label htmlFor="city" className="mb-2">
                City
              </Label>
              <Input id="city" name="city" type="text" value={city} disabled />
            </div>
          </>
        )}

        {/* Stage 2: Academic Information */}
        {currentStage === 2 && (
          <>
            <h3 className="mb-2 mt-5">Academic Information</h3>

            {/* Student ID */}
            <div className="mb-2">
              <div className="flex">
                <Label htmlFor="student_id" className="mb-2">
                  Student ID<span className="text-red-500">*</span>
                </Label>
                {fieldErrors?.student_id && (
                  <p className="ms-2 mb-2 text-xs text-red-600 flex items-center">
                    {fieldErrors.student_id}
                  </p>
                )}
              </div>
              <Input
                id="student_id"
                name="student_id"
                type="text"
                placeholder="2024-00123"
                className={fieldErrors?.student_id ? "border-red-500 bg-red-50" : ""}
              />
            </div>

            {/* Course/Program */}
            <div className="mb-2">
              <div className="flex">
                <Label htmlFor="course" className="mb-2">
                  Course/Program<span className="text-red-500">*</span>
                </Label>
                {fieldErrors?.course && (
                  <p className="ms-2 mb-2 text-xs text-red-600 flex items-center">
                    {fieldErrors.course}
                  </p>
                )}
              </div>
              <select
                id="course"
                name="course"
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  fieldErrors?.course ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              >
                <option value="">Select your course</option>
                <option value="BSIT">Bachelor of Science in Information Technology</option>
                <option value="BSCS">Bachelor of Science in Computer Science</option>
                <option value="BSIS">Bachelor of Science in Information Systems</option>
                <option value="BSECE">Bachelor of Science in Electronics Engineering</option>
                <option value="BSA">Bachelor of Science in Accountancy</option>
                <option value="BSBA">Bachelor of Science in Business Administration</option>
              </select>
            </div>

            {/* Year Level */}
            <div className="mb-2">
              <div className="flex">
                <Label htmlFor="year_level" className="mb-2">
                  Year Level<span className="text-red-500">*</span>
                </Label>
                {fieldErrors?.year_level && (
                  <p className="ms-2 mb-2 text-xs text-red-600 flex items-center">
                    {fieldErrors.year_level}
                  </p>
                )}
              </div>
              <select
                id="year_level"
                name="year_level"
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  fieldErrors?.year_level ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              >
                <option value="">Select year level</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>

            {/* Section */}
            <div className="mb-2">
              <div className="flex">
                <Label htmlFor="section" className="mb-2">
                  Section<span className="text-red-500">*</span>
                </Label>
                {fieldErrors?.section && (
                  <p className="ms-2 mb-2 text-xs text-red-600 flex items-center">
                    {fieldErrors.section}
                  </p>
                )}
              </div>
              <Input
                id="section"
                name="section"
                type="text"
                placeholder="A, B, C, or 1, 2, 3"
                className={fieldErrors?.section ? "border-red-500 bg-red-50" : ""}
              />
            </div>

            {/* GPA (Optional) */}
            <div className="mb-2">
              <Label htmlFor="gpa" className="mb-2">
                GPA (Optional)
              </Label>
              <Input
                id="gpa"
                name="gpa"
                type="number"
                step="0.01"
                placeholder="1.00 - 5.00"
              />
            </div>
          </>
        )}

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
            <button
              type="submit"
              className="rounded text-center text-white bg-red-700 flex-1 p-2 hover:bg-red-800 transition-colors disabled:opacity-50"
              disabled={fetcher.state === "submitting"}
            >
              {fetcher.state === "submitting" ? "Submitting..." : "Submit"}
            </button>
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