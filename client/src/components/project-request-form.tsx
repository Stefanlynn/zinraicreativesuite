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
  description: z.string().min(10, "Description must be at least 10 characters"),
  budgetRange: z.string().min(1, "Please select a budget range"),
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
      description: "",
      budgetRange: "",
      contactMethod: "email",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ProjectRequestFormData) => {
      const requestData = {
        ...data,
        referenceFiles: referenceFiles.map(file => file.name),
      };
      
      const response = await apiRequest('POST', '/api/project-requests', requestData);
      return response.json();
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
    <section id="request" className="py-24 bg-zinrai-dark px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold mb-6 text-white">Request Custom Project</h3>
          <p className="text-xl text-zinrai-muted max-w-2xl mx-auto">
            Need something unique? Our creative team is ready to bring your vision to life.
          </p>
        </div>

        <div className="glass-card p-8 md:p-12">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                          <SelectContent className="bg-zinrai-dark border-zinrai-border">
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
                          <SelectContent className="bg-zinrai-dark border-zinrai-border">
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
                    name="budgetRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Budget Range</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="form-select">
                              <SelectValue placeholder="Select budget range" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-zinrai-dark border-zinrai-border">
                            <SelectItem value="100-500">$100 - $500</SelectItem>
                            <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                            <SelectItem value="1000-2500">$1,000 - $2,500</SelectItem>
                            <SelectItem value="2500+">$2,500+</SelectItem>
                            <SelectItem value="discuss">Let's discuss</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
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
                          <SelectContent className="bg-zinrai-dark border-zinrai-border">
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
                    className="primary-btn text-lg px-12 py-4 disabled:opacity-50"
                  >
                    {mutation.isPending ? "Submitting..." : "Submit Project Request"}
                  </Button>
                </div>
              </form>
            </Form>
        </div>
      </div>
    </section>
  );
}
