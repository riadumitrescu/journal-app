import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2C1D0E]">
      <div className="w-full max-w-md">
        <SignIn 
          afterSignInUrl="/journal" 
          redirectUrl="/journal"
          appearance={{
            elements: {
              formButtonPrimary: "bg-[#2C1D0E] hover:bg-[#4A3F35]",
              footerActionLink: "text-[#2C1D0E] hover:text-[#4A3F35]",
              card: "bg-[#F5F0E5] backdrop-blur-sm border border-[#2C1D0E]/10",
              headerTitle: "text-[#2C1D0E] font-serif",
              headerSubtitle: "text-[#2C1D0E]/80",
              socialButtonsBlockButton: "border-[#2C1D0E]/10 hover:bg-[#E6D5C1]",
              socialButtonsBlockButtonText: "text-[#2C1D0E]",
              formFieldLabel: "text-[#2C1D0E]",
              formFieldInput: "border-[#2C1D0E]/10 focus:border-[#2C1D0E] focus:ring-[#2C1D0E]",
              dividerLine: "bg-[#2C1D0E]/10",
              dividerText: "text-[#2C1D0E]/60",
            },
          }}
        />
      </div>
    </div>
  );
} 