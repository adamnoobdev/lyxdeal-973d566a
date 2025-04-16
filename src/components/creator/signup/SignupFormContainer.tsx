
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreatorForm } from "../CreatorForm";

export const SignupFormContainer = () => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Ansök som kreatör</CardTitle>
      </CardHeader>
      <CardContent>
        <CreatorForm />
      </CardContent>
    </Card>
  );
};
