type ClashFormType = {
  title?: string;
  description?: string;
};

type ClashFormErrorType = {
  title?: string;
  description?: string;
  image?: string;
  expire_at?: string;
};

interface ClashType {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  image: string | null;
  created_at: string;
  expire_at: string;
  ClashItem: Array<{
    id: number;
    image: string;
    count: number;
    clash_id: number;
  }>;
  ClashComments: Array<{
    id: number;
    comment: string;
    created_at: string;
    clash_id: number;
  }>;
}

type ClashItemType = {
  id: number;
  image: string;
  count: number;
};

type ClashCommentType = {
  id: number;
  comment: string;
  created_at: string;
};

type ClashItemForm = {
  image: File | null;
};
