import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import FileUpload from "@/components/ui/file-upload";

const projectRequestSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  projectType: z.string().min(1, "Please select a project type"),
  timeline: z.string().min(1, "Please select a timeline"),
  dueDate: z.string().min(1, "Please select a due date").refine((date) => {
    const selectedDate = new Date(date);
    const threeWeeksFromNow = new Date();
    threeWeeksFromNow.setDate(threeWeeksFromNow.getDate() + 21);
    return selectedDate >= threeWeeksFromNow;
  }, "Due date must be at least 3 weeks from today"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  contactMethod: z.string().min(1, "Please select a contact method"),
});

type ProjectRequestFormData = z.infer<typeof projectRequestSchema>;

export default function ProjectRequestForm() {
  const { toast } = useToast();
  const [referenceFiles, setReferenceFiles] = useState<File[]>([]);

  const form = useForm<ProjectRequestFormData>({
    resolver: zodResolver(projectRequestSchema),
    defaultValues: {
      fullName: "",
      email: "",
      projectType: "",
      timeline: "",
      dueDate: "",
      description: "",
      contactMethod: "email",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ProjectRequestFormData) => {
      // Create form data for Netlify Forms (this will send email)
      const formData = new FormData();
      formData.append('form-name', 'project-request');
      formData.append('full-name', data.fullName);
      formData.append('email', data.email);
      formData.append('project-type', data.projectType);
      formData.append('timeline', data.timeline);
      formData.append('due-date', data.dueDate);
      formData.append('description', data.description);
      formData.append('contact-method', data.contactMethod);
      formData.append('reference-files', referenceFiles.map(file => file.name).join(', '));
      
      // Submit to Netlify Forms for email notification
      const netlifyResponse = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as any).toString(),
      });
      
      // Also save to database for admin dashboard
      const requestData = {
        ...data,
        referenceFiles: referenceFiles.map(file => file.name),
      };
      
      const apiResponse = await apiRequest('POST', '/api/project-requests', requestData);
      return apiResponse;
    },
    onSuccess: () => {
      toast({
        title: "Project Request Submitted",
        description: "We will contact you within 24 hours to discuss your project.",
      });
      form.reset();
      setReferenceFiles([]);
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProjectRequestFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="text-center mb-12">
        <h3 className="text-3xl font-bold mb-4 text-white">Tell Us About Your Project</h3>
        <p className="text-lg text-zinrai-muted max-w-2xl mx-auto">
          Fill out the form below and we'll get back to you within 24 hours to discuss your project in detail.
        </p>
      </div>

      <div className="bg-zinrai-surface rounded-xl p-8 border border-yellow-500/20">
            <Form {...form}>
              <form 
                onSubmit={form.handleSubmit(onSubmit)} 
                className="space-y-6"
                name="project-request"
                method="POST"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
              >
                {/* Hidden fields for Netlify Forms */}
                <input type="hidden" name="form-name" value="project-request" />
                <div style={{ display: 'none' }}>
                  <input name="bot-field" />
                </div>
                
                {/* Hidden inputs that match the form structure for Netlify */}
                <input type="hidden" name="full-name" />
                <input type="hidden" name="email" />
                <input type="hidden" name="project-type" />
                <input type="hidden" name="timeline" />
                <input type="hidden" name="due-date" />
                <input type="hidden" name="description" />
                <input type="hidden" name="contact-method" />
                <input type="hidden" name="reference-files" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Full Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your full name" 
                            className="form-input"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="your.email@example.com" 
                            className="form-input"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="projectType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Project Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="form-select">
                              <SelectValue placeholder="Select project type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white border-gray-300 text-black">
                            <SelectItem value="social-media">Social Media Content</SelectItem>
                            <SelectItem value="video-production">Video Production</SelectItem>
                            <SelectItem value="graphic-design">Graphic Design</SelectItem>
                            <SelectItem value="event-materials">Event Materials</SelectItem>
                            <SelectItem value="brand-merchandise">Brand Merchandise</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timeline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Timeline</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="form-select">
                              <SelectValue placeholder="Select timeline" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white border-gray-300 text-black">
                            <SelectItem value="rush">Rush (1-3 days)</SelectItem>
                            <SelectItem value="standard">Standard (1-2 weeks)</SelectItem>
                            <SelectItem value="extended">Extended (2-4 weeks)</SelectItem>
                            <SelectItem value="flexible">Flexible</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Due Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            className="form-input"
                            min={new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-zinrai-muted mt-1">
                          Projects require a minimum of 3 weeks advance notice
                        </p>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Project Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          rows={4}
                          placeholder="Describe your project in detail. Include dimensions, style preferences, brand guidelines, and any specific requirements..."
                          className="form-textarea"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Due Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            className="form-input"
                            min={new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-zinrai-muted mt-1">
                          Projects require a minimum of 3 weeks advance notice
                        </p>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Preferred Contact Method</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="form-select">
                              <SelectValue placeholder="Select contact method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white border-gray-300 text-black">
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="phone">Phone</SelectItem>
                            <SelectItem value="video-call">Video Call</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormLabel className="text-white mb-2 block">Reference Files</FormLabel>
                  <FileUpload onFilesChange={setReferenceFiles} />
                </div>

                <div className="text-center">
                  <Button 
                    type="submit" 
                    disabled={mutation.isPending}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-8 py-3 rounded-lg disabled:opacity-50"
                  >
                    {mutation.isPending ? "Submitting..." : "Submit Project Request"}
                  </Button>
                </div>
              </form>
            </Form>
        </div>
      </div>
  );
}
