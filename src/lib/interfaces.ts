interface NBCPaper {
    _id: string;
    entityId: string;
    entityType: string;
    metadata: {
      title: string;
      author: string;
      status: string;
      createdAt: string;
      updatedAt: string;
    };
    collaborators: Collaborator[];
    content: Record<string, {
      section_title: string;
      htmlContent: string;
    }>;
  }
    interface Collaborator {
        userId: string;
        email: string;
        role: 'can_edit' | 'can_view' | 'owner';
        invitedAt: string;
        firstName?: string;
        lastName?: string;
        profilePicture?: string;
    }


  interface Section {
    id: string;
    title: string;
    content: string;
    subsections?: Subsection[];
  }
  
  interface Subsection {
    title: string;
    htmlContent: string;
  }
  

  interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role?: string;
  }
  interface Paper {
    _id: string;
    entityId: string;
    entityType: string;
    metadata: {
        title: string;
        author: string;
        status: string;
        createdAt: string;
        updatedAt: string;
    };
    collaborators?: any[];
}

  export type { NBCPaper, User, Section, Subsection, Collaborator, Paper };