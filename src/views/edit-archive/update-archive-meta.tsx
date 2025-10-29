import { Edit, Loader2 } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { toast } from "sonner";
import type { KeyedMutator } from "swr";

import type { ZArchiveByID } from "~/entities/archives/models";

import fetchApi from "~/shared/lib/api/fetch";
import { useVisibilityToggle } from "~/shared/hooks/use-visibility-toggle";
import type { ApiResponse } from "~/shared/lib/next/nx-response";
import { Button } from "~/shared/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/shared/ui/dialog";
import { Input } from "~/shared/ui/input";
import { Label } from "~/shared/ui/label";
import { Switch } from "~/shared/ui/switch";

import { useMetaValidate } from "~/widgets/use-meta-validate";

interface UpdateArchiveMetaProps {
	revalidateArchive: KeyedMutator<ApiResponse<ZArchiveByID>>;
	archiveId: string;
	title: string;
	description: string;
	isPublic?: boolean;
}

export default function UpdateArchiveMeta({
	revalidateArchive,
	archiveId,
	title,
	description,
	isPublic = true,
}: UpdateArchiveMetaProps) {
	const { handleOnChange, meta, metaError, submitDisabled } = useMetaValidate(
		{
			description,
			title,
		}
	);

	const {
		isPublicState,
		isLoading: isPublicLoading,
		handleToggle,
	} = useVisibilityToggle({
		id: archiveId,
		initialIsPublic: isPublic,
		endpoint: "archives",
		revalidate: revalidateArchive,
	});

	const [isSubmitting, setIsSubmitting] = useState(false);

	async function updateArchiveMeta(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		// Prevent double-submit
		if (isSubmitting) {
			return;
		}

		setIsSubmitting(true);
		try {
			const result = await fetchApi(`/archives/${archiveId}/update`, {
				body: JSON.stringify({
					description: meta.description,
					title: meta.title,
				}),
				method: "PATCH",
			});

			// If we reach here, fetchApi didn't throw (success case)
			toast.success(result.message);
			revalidateArchive();
		} catch (err: any) {
			// fetchApi throws on !success, extract the actual response from err.cause
			if (err.cause) {
				try {
					const errorResponse = await err.cause;
					const errorMessage =
						errorResponse.error?.details || errorResponse.message;
					toast.error(errorMessage);
				} catch {
					toast.error("Failed to update archive metadata.");
				}
			} else {
				toast.error("Failed to update archive metadata.");
			}
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>
					<Edit />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Update Archive</DialogTitle>
				</DialogHeader>
				<form
					className="flex flex-col gap-2"
					onSubmit={updateArchiveMeta}>
					<div className="space-y-2">
						<Label htmlFor="title">Title</Label>
						<Input
							id="title"
							value={meta.title}
							name="title"
							onChange={handleOnChange}
						/>
						{metaError.title ? (
							<p className="text-sm text-[hsl(var(--primary))]">
								{metaError.title}
							</p>
						) : null}
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Input
							id="description"
							value={meta.description}
							name="description"
							onChange={handleOnChange}
						/>
						{metaError.description ? (
							<p className="text-sm text-[hsl(var(--primary))]">
								{metaError.description}
							</p>
						) : null}
					</div>

					<div className="flex items-center justify-between space-y-2 pt-2">
						<div className="flex flex-col gap-1">
							<Label
								htmlFor="visibility"
								className="text-sm font-medium">
								Public Archive
							</Label>
							<p className="text-xs text-muted-foreground">
								Make this archive visible to everyone
							</p>
						</div>
						<div className="flex items-center gap-2">
							{isPublicLoading && (
								<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
							)}
							<Switch
								id="visibility"
								checked={isPublicState}
								onCheckedChange={handleToggle}
								disabled={isPublicLoading}
								className="data-[state=checked]:bg-[#A81434] data-[state=unchecked]:bg-input"
							/>
						</div>
					</div>

					<DialogFooter>
						<DialogClose asChild>
							<Button
								disabled={
									Boolean(submitDisabled) || isSubmitting
								}
								type="submit">
								{isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Updating…
									</>
								) : (
									"Update"
								)}
							</Button>
						</DialogClose>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
