import { Edit, Loader2 } from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { KeyedMutator } from "swr";

import type { ZCatalogByID } from "~/entities/catalogs/models";

import fetchApi from "~/shared/lib/api/fetch";
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

interface UpdateCatalogMetaProps {
	revalidateCatalog: KeyedMutator<ApiResponse<ZCatalogByID>>;
	catalogId: string;
	title: string;
	description: string;
	isPublic?: boolean;
}

export default function UpdateCatalogMeta({
	revalidateCatalog,
	catalogId,
	title,
	description,
	isPublic = true,
}: UpdateCatalogMetaProps) {
	const { meta, metaError, handleOnChange, submitDisabled } = useMetaValidate(
		{
			description,
			title,
		}
	);

	const [isPublicState, setIsPublicState] = useState(isPublic);
	const [isPublicLoading, setIsPublicLoading] = useState(false);

	// Sync local state with prop changes (e.g., after refetch)
	useEffect(() => {
		setIsPublicState(isPublic);
	}, [isPublic]);

	async function updateCatalogMeta(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const result = await fetchApi(`/catalogs/${catalogId}/update`, {
			body: JSON.stringify({
				description: meta.description,
				title: meta.title,
			}),
			method: "PATCH",
		});

		if (!result.success) {
			toast(result.message);
		} else {
			revalidateCatalog();
		}
	}

	async function handleVisibilityToggle(checked: boolean) {
		setIsPublicLoading(true);
		try {
			const result = await fetchApi(`/catalogs/${catalogId}/visibility`, {
				body: JSON.stringify({ isPublic: checked }),
				method: "PATCH",
			});

			// If we reach here, fetchApi didn't throw (success case)
			setIsPublicState(checked);
			toast.success(result.message);
			revalidateCatalog();
		} catch (err: any) {
			// fetchApi throws on !success, extract the actual response from err.cause
			if (err.cause) {
				try {
					const errorResponse = await err.cause;
					const errorMessage =
						errorResponse.error?.details || errorResponse.message;
					toast.error(errorMessage);
				} catch {
					toast.error("Failed to update visibility status.");
				}
			} else {
				// Unexpected runtime error (network failure, etc.)
				toast.error("An unexpected error occurred. Please try again.");
			}
		} finally {
			setIsPublicLoading(false);
		}
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="ghost" size="icon">
					<Edit />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Update Catalog</DialogTitle>
				</DialogHeader>
				<form
					className="flex flex-col gap-2"
					onSubmit={updateCatalogMeta}>
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
								Public Catalog
							</Label>
							<p className="text-xs text-muted-foreground">
								Make this catalog visible to everyone
							</p>
						</div>
						<div className="flex items-center gap-2">
							{isPublicLoading && (
								<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
							)}
							<Switch
								id="visibility"
								checked={isPublicState}
								onCheckedChange={handleVisibilityToggle}
								disabled={isPublicLoading}
								className="data-[state=checked]:bg-[#A81434] data-[state=unchecked]:bg-input"
							/>
						</div>
					</div>

					<DialogFooter>
						<DialogClose asChild>
							<Button
								disabled={Boolean(submitDisabled)}
								type="submit">
								Update
							</Button>
						</DialogClose>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
