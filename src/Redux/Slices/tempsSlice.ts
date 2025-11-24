
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TemplateType {
  id: number;
  type: any; // أو React.FC<Props>
  withColumn: boolean;
  withImage: boolean;
}

interface TemplateState {
  storedTemplates: TemplateType[];
}

const initialState: TemplateState = {
  storedTemplates: [],
};

const storedTemplatesSlice = createSlice({
  name: 'storedTemplates',
  initialState,
  reducers: {
    setStoredTemplates(state, action: PayloadAction<TemplateType[]>) {
      state.storedTemplates = action.payload;
    },
    clearStoredTemplates(state) {
      state.storedTemplates = [];
    },
  },
});

export const { setStoredTemplates, clearStoredTemplates } = storedTemplatesSlice.actions;
export default storedTemplatesSlice.reducer;
