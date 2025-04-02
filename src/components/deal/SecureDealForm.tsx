
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export interface SecureDealFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  acceptTerms: boolean;
  acceptMarketing?: boolean;
}

interface SecureDealFormProps {
  onSubmit: (values: SecureDealFormValues) => void;
  isSubmitting: boolean;
}

export const SecureDealForm = ({ onSubmit, isSubmitting }: SecureDealFormProps) => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<SecureDealFormValues>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    acceptTerms: false,
    acceptMarketing: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formValues.firstName.trim()) {
      newErrors.firstName = 'Förnamn är obligatoriskt';
    }
    
    if (!formValues.lastName.trim()) {
      newErrors.lastName = 'Efternamn är obligatoriskt';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formValues.email.trim() || !emailRegex.test(formValues.email)) {
      newErrors.email = 'En giltig e-postadress krävs';
    }
    
    const phoneRegex = /^[0-9\s+-]{6,15}$/;
    if (!formValues.phone.trim() || !phoneRegex.test(formValues.phone)) {
      newErrors.phone = 'Ett giltigt telefonnummer krävs';
    }
    
    if (!formValues.acceptTerms) {
      newErrors.acceptTerms = 'Du måste acceptera villkoren';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formValues);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Button 
          type="button" 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4 p-0 h-auto text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Tillbaka till erbjudandet
        </Button>
        
        <h1 className="text-xl font-bold mb-1">Säkra din rabatt</h1>
        <p className="text-sm text-gray-600 mb-6">
          Fyll i dina uppgifter nedan för att få din unika rabattkod.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Förnamn *</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formValues.firstName}
              onChange={handleChange}
              required
              className={errors.firstName ? 'border-red-500' : ''}
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs">{errors.firstName}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Efternamn *</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formValues.lastName}
              onChange={handleChange}
              required
              className={errors.lastName ? 'border-red-500' : ''}
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs">{errors.lastName}</p>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">E-post *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formValues.email}
            onChange={handleChange}
            required
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Telefonnummer *</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formValues.phone}
            onChange={handleChange}
            required
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs">{errors.phone}</p>
          )}
        </div>
        
        <Alert className="bg-blue-50 border-blue-100">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-xs text-gray-700">
            Din rabattkod skickas till din e-post och telefon. Du behöver visa upp den när du besöker salongen.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-3 pt-2">
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="acceptTerms" 
              name="acceptTerms"
              checked={formValues.acceptTerms} 
              onCheckedChange={(checked) => 
                setFormValues(prev => ({ ...prev, acceptTerms: checked === true }))
              }
              className={errors.acceptTerms ? 'border-red-500' : ''}
            />
            <Label 
              htmlFor="acceptTerms" 
              className="text-sm font-normal leading-tight cursor-pointer"
            >
              Jag accepterar <a href="/terms" target="_blank" className="text-primary hover:underline">villkoren</a> och <a href="/privacy" target="_blank" className="text-primary hover:underline">integritetspolicyn</a> *
            </Label>
          </div>
          {errors.acceptTerms && (
            <p className="text-red-500 text-xs ml-6">{errors.acceptTerms}</p>
          )}
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="acceptMarketing" 
              name="acceptMarketing"
              checked={formValues.acceptMarketing} 
              onCheckedChange={(checked) => 
                setFormValues(prev => ({ ...prev, acceptMarketing: checked === true }))
              }
            />
            <Label 
              htmlFor="acceptMarketing" 
              className="text-sm font-normal leading-tight cursor-pointer"
            >
              Jag vill få erbjudanden och nyheter via e-post
            </Label>
          </div>
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Bearbetar...' : 'Få min rabattkod'}
      </Button>
    </form>
  );
};
