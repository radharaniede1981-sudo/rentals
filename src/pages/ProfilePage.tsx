import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Star, Edit, Save, X, Camera, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    profilePicture: '',
    totalRentals: 0,
    totalSpent: 0,
    rating: 0,
    rentalCount: 0
  });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  });
  const { toast } = useToast();
  const { user, token } = useAuth();

  // Fetch profile data from MongoDB
  const fetchProfileData = async () => {
    if (!token) return;
    
    try {
      const response = await fetch('http://localhost:3001/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData(data.profile);
        setFormData({
          firstName: data.profile.firstName || '',
          lastName: data.profile.lastName || '',
          email: data.profile.email || '',
          phone: data.profile.phone || '',
          address: data.profile.address || ''
        });
      } else {
        console.error('Failed to fetch profile data');
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile data
  const updateProfile = async () => {
    if (!token) return;
    
    try {
      const response = await fetch('http://localhost:3001/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData(data.profile);
        setIsEditing(false);
        toast({
          title: "Profile Updated",
          description: "Your profile information has been saved successfully.",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Update Failed",
          description: errorData.error || "Failed to update profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: "An error occurred while updating your profile",
        variant: "destructive",
      });
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle profile picture upload
  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageData = event.target?.result as string;
        
        const response = await fetch('http://localhost:3001/api/auth/upload-profile-picture', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageData }),
        });

        if (response.ok) {
          const data = await response.json();
          setProfileData(prev => ({
            ...prev,
            profilePicture: data.profilePicture
          }));
          toast({
            title: "Profile picture updated",
            description: "Your profile picture has been updated successfully.",
          });
        } else {
          const errorData = await response.json();
          toast({
            title: "Upload failed",
            description: errorData.error || "Failed to upload profile picture",
            variant: "destructive",
          });
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast({
        title: "Upload failed",
        description: "An error occurred while uploading your profile picture",
        variant: "destructive",
      });
    }
  };

  // Load profile data on component mount
  useEffect(() => {
    fetchProfileData();
  }, [token]);

  const handleSave = () => {
    updateProfile();
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-muted-foreground">Manage your account settings and view your rental history</p>
          </div>
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if no user
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-muted-foreground">Manage your account settings and view your rental history</p>
          </div>
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Please log in to view your profile</h2>
              <p className="text-muted-foreground">You need to be logged in to access your profile information.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and view your rental history</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                                 <div className="relative mx-auto w-24 h-24 mb-4">
                   {profileData.profilePicture ? (
                     <div className="w-full h-full rounded-full overflow-hidden">
                       <img 
                         src={profileData.profilePicture} 
                         alt="Profile" 
                         className="w-full h-full object-cover"
                       />
                     </div>
                   ) : (
                     <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
                       <User className="h-12 w-12 text-muted-foreground" />
                     </div>
                   )}
                   <label htmlFor="profile-picture-upload" className="cursor-pointer">
                     <Button size="icon" variant="secondary" className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full">
                       <Camera className="h-4 w-4" />
                     </Button>
                   </label>
                   <input
                     id="profile-picture-upload"
                     type="file"
                     accept="image/*"
                     onChange={handleProfilePictureUpload}
                     className="hidden"
                   />
                 </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <h2 className="text-xl font-semibold">
                      {isLoading ? 'Loading...' : `${profileData.firstName} ${profileData.lastName}`}
                    </h2>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    {isLoading ? 'Loading...' : profileData.email}
                  </p>
                  <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    <span>{isLoading ? '...' : profileData.rating.toFixed(1)}</span>
                    <span>•</span>
                    <span>{isLoading ? '...' : `${profileData.rentalCount} rentals`}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {isLoading ? '...' : profileData.totalRentals}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Rentals</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {isLoading ? '...' : `₹${profileData.totalSpent.toLocaleString()}`}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Spent</div>
                  </div>
                </div>
                
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-1">
                <TabsTrigger value="profile">Profile</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <User className="h-5 w-5 mr-2" />
                        Personal Information
                      </CardTitle>
                      {!isEditing ? (
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      ) : (
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                          <Button size="sm" onClick={handleSave}>
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          disabled={!isEditing} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          disabled={!isEditing} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing} 
                        />
                      </div>
                      
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input 
                        id="address" 
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing} 
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>






            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
