import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import {
  BookOpen,
  Building,
  Calendar,
  GraduationCap,
  Hash,
  Mail,
  MapPin,
  Phone,
  User,
  Users,
} from "lucide-react";

interface User {
  id: string | number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  role?: "student" | "employer" | "admin";
  Student?: {
    YearLevel: number;
    Section?: string;
    Course?: {
      Name: string;
      College?: {
        Name: string;
      };
    };
  };
  // add other fields as needed
}

interface UserProfileProps {
  user: User;
  showEditButton?: boolean;
  onEdit?: () => void;
}

export function UserProfile({ user, showEditButton = false, onEdit }: UserProfileProps) {
  const fullName = `${user.first_name} ${user.middle_name ? user.middle_name + " " : ""}${user.last_name}`;
  const initials = `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase();
  const isStudent = user.role === "student" && user.Student;

  // Helper for year level suffix
  const getYearSuffix = (year: number) => {
    if (year === 1) return "st";
    if (year === 2) return "nd";
    if (year === 3) return "rd";
    return "th";
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="bg-red-100 text-red-700 text-xl font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-2xl">{fullName}</CardTitle>
          <CardDescription className="flex items-center gap-2 mt-1">
            <Mail className="h-3.5 w-3.5" />
            <span>{user.email}</span>
            {user.role && (
              <Badge variant="secondary" className="ml-2 capitalize">
                {user.role}
              </Badge>
            )}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <User className="h-4 w-4" /> Personal Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {user.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              </div>
            )}
            {user.address && (
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="font-medium">{user.address}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Academic Information (for students) */}
        {isStudent && (
          <>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <GraduationCap className="h-4 w-4" /> Academic Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.Student!.YearLevel && (
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-5 w-5 text-indigo-600" />
                    <div>
                      <p className="text-xs text-gray-500">Year Level</p>
                      <p className="font-semibold">
                        {user.Student!.YearLevel}
                        {getYearSuffix(user.Student!.YearLevel)} Year
                      </p>
                    </div>
                  </div>
                )}
                {user.Student!.Section && (
                  <div className="flex items-center gap-3">
                    <Hash className="h-5 w-5 text-teal-600" />
                    <div>
                      <p className="text-xs text-gray-500">Section</p>
                      <p className="font-semibold">{user.Student!.Section}</p>
                    </div>
                  </div>
                )}
                {user.Student!.Course?.Name && (
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-cyan-600" />
                    <div>
                      <p className="text-xs text-gray-500">Course</p>
                      <p className="font-semibold">{user.Student!.Course.Name}</p>
                    </div>
                  </div>
                )}
                {user.Student!.Course?.College?.Name && (
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-xs text-gray-500">College</p>
                      <p className="font-semibold">{user.Student!.Course.College.Name}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Meta Information */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Account Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">User ID</p>
                <p className="font-medium">{user.id}</p>
              </div>
            </div>
            {/* Add created/updated dates if available */}
          </div>
        </div>

        {showEditButton && (
          <div className="pt-4">
            <Button onClick={onEdit} variant="outline" className="w-full">
              Edit Profile
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}