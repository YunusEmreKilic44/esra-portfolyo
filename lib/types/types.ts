export interface ContactType {
  title: string;
  email: string;
  linkedin: string;
}

export interface CollectionImageType {
  id: string;
  imageUrl: string;
  publicId: string;
  collectionId: string;
}

export interface CollectionType {
  id: string;
  title: string;
  category: string;
  year: string;
  material: string;
  description: string;
  detail: string;
  images: CollectionImageType[];
}

export interface LookbookImageType {
  id: string;
  imageUrl: string;
  publicId: string;
}

export interface AboutType {
  id: string;
  title: string;
  content: string;
  bio1: string;
  bio2: string;
  education: string;
  uzmanlik: string;
  applications: string;
  languages: string;
}

export interface PortraitImageType {
  id: string;
  imageUrl: string;
  publicId: string;
}
