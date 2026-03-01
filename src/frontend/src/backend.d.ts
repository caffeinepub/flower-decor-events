import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface EventImage {
    id: bigint;
    categoryId: bigint;
    caption: string;
    blobId: string;
    uploadedAt: bigint;
}
export interface EventCategory {
    id: bigint;
    order: bigint;
    name: string;
    description: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addImage(categoryId: bigint, blobId: string, caption: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    checkAdmin(): Promise<boolean>;
    getAllImages(): Promise<Array<EventImage>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategories(): Promise<Array<EventCategory>>;
    getImagesByCategory(categoryId: bigint): Promise<Array<EventImage>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeImage(imageId: bigint): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateCategoryDescription(categoryId: bigint, description: string): Promise<boolean>;
}
