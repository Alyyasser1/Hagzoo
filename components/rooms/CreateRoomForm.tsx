"use client";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import "./CreateRoomForm.css";
export const roomSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  location: z.string().min(3, "Location is required"),
  sport: z.enum(["football", "tennis", "padel", "padbol"]),
  scheduled_date: z.string().min(1, "Date is required"),
  scheduled_time: z.string().min(1, "Time is required"),
  max_players: z.number().int().min(2, "At least 2 players needed"),
  level: z.enum(["beginner", "intermediate", "advanced"]),
});

interface CreateRoomFormProps {
  onSuccess: () => void;
}
export type RoomFormValues = z.infer<typeof roomSchema>;
const CreateRoomForm = ({ onSuccess }: CreateRoomFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      sport: "football",
      level: "intermediate",
      max_players: 10,
    },
  });

  const onSubmit: SubmitHandler<RoomFormValues> = async (
    data: RoomFormValues,
  ) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        onSuccess();
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to create the room", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="create-room-form">
      <Input
        id="name"
        label="Room Name"
        placeholder="e.g., Friday Night Champions"
        {...register("name")}
        error={errors.name?.message}
      />
      <div className="form-row">
        <Input
          id="location"
          label="Location"
          placeholder="Enter club or stadium"
          {...register("location")}
          error={errors.location?.message}
        />
      </div>
      <div className="form-grid">
        <div className="select-group">
          <label className="form-label">Sport</label>
          <select {...register("sport")} className="custom-select">
            <option value="football">Football</option>
            <option value="padel">Padel</option>
            <option value="tennis">Tennis</option>
            <option value="padbol">Padbol</option>
          </select>
        </div>
        <div className="select-group">
          <label className="form-label">Level</label>
          <select {...register("level")} className="custom-select">
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>
      <div className="form-grid">
        <Input
          id="scheduled_date"
          label="Date"
          type="date"
          {...register("scheduled_date")}
          error={errors.scheduled_date?.message}
        />
        <Input
          id="scheduled_time"
          label="Time"
          type="time"
          {...register("scheduled_time")}
          error={errors.scheduled_time?.message}
        />
      </div>

      <Input
        id="max_players"
        label="Room Players"
        type="number"
        {...register("max_players", { valueAsNumber: true })}
        error={errors.max_players?.message}
      />
      <Button
        variant="primary"
        type="submit"
        size="full"
        isLoading={isSubmitting}
        style={{ marginTop: "12px" }}
      >
        Create Room
      </Button>
    </form>
  );
};

export default CreateRoomForm;
