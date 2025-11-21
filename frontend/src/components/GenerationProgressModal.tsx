import { useEffect, useRef, useState } from 'react';

import { Box, Stack, Text } from '@mantine/core';

import { StyledModal } from './StyledModal';

interface GenerationStep {
  name: string;
  duration: number; // in seconds
}

const GENERATION_STEPS: GenerationStep[] = [
  { name: 'Setup', duration: 0.15 },
  { name: 'Select Attributes', duration: 0.6 },
  { name: 'Build Base Prompts', duration: 0.8 },
  { name: 'Enhance Prompt', duration: 1.7 },
  { name: 'Image Prep', duration: 0.3 },
  { name: 'Image Generation', duration: 3.2 },
  { name: 'Image Download', duration: 1.4 },
  { name: 'Add Caption', duration: 1.2 },
  { name: 'Save Files', duration: 0.45 },
];

interface GenerationProgressModalProps {
  opened: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const GenerationProgressModal = ({
  opened,
  onClose,
  onComplete,
}: GenerationProgressModalProps) => {
  const [currentStep, setCurrentStep] = useState(-1);
  const [stepStartTime, setStepStartTime] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState<
    Array<{ name: string; duration: number }>
  >([]);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when content changes
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [currentStep, completedSteps]);

  useEffect(() => {
    if (!opened) {
      // Reset state when modal closes
      setCurrentStep(-1);
      setStepStartTime(null);
      setCompletedSteps([]);
      return;
    }

    // Start the process
    setCurrentStep(0);
    setStepStartTime(Date.now());
  }, [opened]);

  useEffect(() => {
    if (currentStep === -1 || currentStep >= GENERATION_STEPS.length) return;

    const step = GENERATION_STEPS[currentStep];
    if (!step) return;

    const timer = setTimeout(() => {
      const elapsed = stepStartTime
        ? (Date.now() - stepStartTime) / 1000
        : step.duration;

      setCompletedSteps((prev) => [
        ...prev,
        { name: step.name, duration: elapsed },
      ]);

      if (currentStep === GENERATION_STEPS.length - 1) {
        // All steps complete
        setTimeout(() => {
          onComplete();
          onClose();
        }, 500);
      } else {
        // Move to next step
        setCurrentStep(currentStep + 1);
        setStepStartTime(Date.now());
      }
    }, step.duration * 1000);

    return () => clearTimeout(timer);
  }, [currentStep, stepStartTime, onComplete, onClose]);

  const renderStepLine = (step: GenerationStep, index: number) => {
    const isCompleted = index < completedSteps.length;
    const isCurrent = index === currentStep;
    const completedStep = completedSteps[index];

    if (isCompleted && completedStep) {
      return (
        <Text
          key={index}
          style={{ fontFamily: 'inherit', color: '#00ff00', fontSize: '14px' }}
        >
          {`Step ${index + 1}: ${step.name}...${completedStep.duration.toFixed(2)}s`}
        </Text>
      );
    }

    if (isCurrent) {
      return (
        <Text
          key={index}
          style={{ fontFamily: 'inherit', color: '#00ff00', fontSize: '14px' }}
        >
          {`Step ${index + 1}: ${step.name}...`}
        </Text>
      );
    }

    return null;
  };

  return (
    <StyledModal
      opened={opened}
      onClose={onClose}
      title="Generating Image"
      centered
      size="lg"
      closeOnClickOutside={false}
      closeOnEscape={false}
      withCloseButton={currentStep === -1}
    >
      <Box
        style={{
          backgroundColor: '#000000',
          padding: '20px',
          borderRadius: '8px',
          height: '320px',
          fontFamily: '"Monaco", "Menlo", "Ubuntu Mono", monospace',
          border: '2px solid #333333',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Stack gap="xs" style={{ flex: '0 0 auto' }}>
          <Text
            style={{
              color: '#00ff00',
              fontFamily: 'inherit',
              marginBottom: '8px',
              fontSize: '14px',
            }}
          >
            $ dalle-dress generate --address {'{'}address{'}'} --series {'{'}
            series{'}'}
          </Text>
          <Text
            style={{
              color: '#00ff00',
              fontFamily: 'inherit',
              marginBottom: '16px',
              fontSize: '14px',
            }}
          >
            ================================================================
          </Text>
        </Stack>

        <Box
          ref={scrollAreaRef}
          style={{
            flex: '1 1 auto',
            overflowY: 'auto',
            marginTop: '16px',
            paddingRight: '8px',
          }}
        >
          <Stack gap="xs">
            {GENERATION_STEPS.map((step, index) => renderStepLine(step, index))}

            {currentStep >= GENERATION_STEPS.length && (
              <Text
                style={{
                  color: '#00ff00',
                  fontFamily: 'inherit',
                  marginTop: '16px',
                  fontSize: '14px',
                }}
              >
                ✓ Generation Complete! Image ready.
              </Text>
            )}
          </Stack>
        </Box>
      </Box>
    </StyledModal>
  );
};
