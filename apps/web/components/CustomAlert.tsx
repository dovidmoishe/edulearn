import { AlertCircleIcon, CheckCircle2Icon, InfoIcon, AlertTriangleIcon } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

interface CustomAlertProps {
  variant?: "default" | "destructive" | "success" | "warning" | "info";
  title: string;
  description?: string;
  onClose?: () => void;
  className?: string;
}

export function CustomAlert({ 
  variant = "default", 
  title, 
  description, 
  onClose,
  className 
}: CustomAlertProps) {
  const getIcon = () => {
    switch (variant) {
      case "success":
        return <CheckCircle2Icon className="h-4 w-4" />;
      case "destructive":
        return <AlertCircleIcon className="h-4 w-4" />;
      case "warning":
        return <AlertTriangleIcon className="h-4 w-4" />;
      case "info":
        return <InfoIcon className="h-4 w-4" />;
      default:
        return <InfoIcon className="h-4 w-4" />;
    }
  };

  return (
    <Alert variant={variant} className={`relative ${className || ""}`}>
      {getIcon()}
      <AlertTitle className="text-sm font-semibold">
        {title}
      </AlertTitle>
      {description && (
        <AlertDescription className="text-xs mt-1">
          {description}
        </AlertDescription>
      )}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span className="sr-only">Close</span>
        </button>
      )}
    </Alert>
  )
}

export function AlertDemo() {
  return (
    <div className="grid w-full max-w-xl items-start gap-4">
      <CustomAlert
        variant="success"
        title="Success! Your changes have been saved"
        description="This is a success alert with the EduLearn green accent color."
      />
      <CustomAlert
        variant="info"
        title="This Alert has a title and an icon. No description."
      />
      <CustomAlert
        variant="warning"
        title="Warning: Check your input"
        description="Please review the information you've entered and make sure it's correct."
      />
      <CustomAlert
        variant="destructive"
        title="Unable to process your payment."
        description="Please verify your billing information and try again. Check your card details, ensure sufficient funds, and verify billing address."
      />
    </div>
  )
}