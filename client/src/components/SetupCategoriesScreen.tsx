import { useState, useCallback } from 'react';
import { ArrowLeft, Plus, Trash2, ChevronDown, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface Column {
  id: string;
  name: string;
  type: 'Text' | 'Number' | 'Date' | 'Currency' | 'Enum';
  required: boolean;
  showAdvanced: boolean;
}

interface SetupCategoriesScreenProps {
  folderId: string;
  folderName: string;
  onNavigate: (screen: any) => void;
  onSaveSchema: (folderId: string, data: {
    name: string;
    description: string;
    columns: Column[];
    autoParse: boolean;
    exportEnabled: boolean;
  }) => void;
}

export function SetupCategoriesScreen({
  folderId,
  folderName,
  onNavigate,
  onSaveSchema
}: SetupCategoriesScreenProps) {
  const [editedFolderName, setEditedFolderName] = useState(folderName);
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState<Column[]>([]);
  const [autoParse, setAutoParse] = useState(true);
  const [exportEnabled, setExportEnabled] = useState(false);
  const [nameError, setNameError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Add a new category
  const handleAddCategory = useCallback(() => {
    const newCategory: Column = {
      id: `cat-${Date.now()}`,
      name: '',
      type: 'Text',
      required: false,
      showAdvanced: false
    };
    setCategories(prev => [...prev, newCategory]);
  }, []);

  // Remove a category
  const handleRemoveCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
  }, []);

  // Update category field
  const handleUpdateCategory = useCallback((id: string, field: keyof Column, value: any) => {
    setCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, [field]: value } : cat
    ));
  }, []);

  // Toggle advanced options
  const handleToggleAdvanced = useCallback((id: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, showAdvanced: !cat.showAdvanced } : cat
    ));
  }, []);

  // Validate folder name
  const validateName = (name: string) => {
    if (!name.trim()) {
      setNameError('Folder name required');
      return false;
    }
    setNameError('');
    return true;
  };

  // Handle save
  const handleSave = async () => {
    if (!validateName(editedFolderName)) return;

    setIsSaving(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    onSaveSchema(folderId, {
      name: editedFolderName.trim(),
      description: description.trim(),
      columns: categories,
      autoParse,
      exportEnabled
    });

    setIsSaving(false);
  };

  // Handle skip
  const handleSkip = () => {
    onNavigate('folder-contents');
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E5EA] sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('files-grid')}
            className="w-10 h-10 text-[#E85C3C] hover:bg-[#F2F2F7] rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-bold text-[#1A1A1A] tracking-[0.1em] uppercase">
              SETUP CATEGORIES
            </h1>
            <p className="text-xs text-[#6B6B6B] font-medium mt-0.5">
              {editedFolderName}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Section 1: Folder Info */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#E5E5EA]">
          <h2 className="text-xs font-bold text-[#E85C3C] tracking-[0.1em] uppercase mb-4">
            FOLDER INFO
          </h2>
          
          <div className="space-y-4">
            {/* Folder Name */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Folder Name
              </label>
              <Input
                value={editedFolderName}
                onChange={(e) => {
                  setEditedFolderName(e.target.value);
                  validateName(e.target.value);
                }}
                placeholder="e.g. Q1 2025 Receipts"
                className={`w-full bg-[#F2F2F7] border-0 rounded-xl px-4 py-3 text-base placeholder:text-[#6B6B6B] focus:bg-white focus:border-2 transition-all duration-150 ${
                  nameError ? 'focus:border-red-500' : 'focus:border-[#E85C3C]'
                }`}
              />
              {nameError && (
                <p className="mt-2 text-sm text-red-600 font-medium">
                  {nameError}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Description (Optional)
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description to help organize this folder..."
                className="w-full bg-[#F2F2F7] border-0 rounded-xl px-4 py-3 text-base placeholder:text-[#6B6B6B] focus:bg-white focus:border-2 focus:border-[#E85C3C] focus:ring-0 transition-all duration-150 min-h-[80px] resize-none"
                maxLength={200}
              />
              <p className="mt-2 text-xs text-[#6B6B6B] text-right">
                {description.length}/200
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Categories */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#E5E5EA]">
          <h2 className="text-xs font-bold text-[#E85C3C] tracking-[0.1em] uppercase mb-2">
            CATEGORIES
          </h2>
          <p className="text-sm text-[#6B6B6B] font-medium mb-4">
            Define the fields you want this folder to track
          </p>

          {/* Empty State */}
          {categories.length === 0 && (
            <div className="py-8 px-4 text-center border-2 border-dashed border-[#E5E5EA] rounded-xl mb-4">
              <p className="text-sm text-[#6B6B6B] font-medium">
                No categories yet. Tap + Add Category to start.
              </p>
            </div>
          )}

          {/* Category List */}
          {categories.length > 0 && (
            <div className="space-y-3 mb-4">
              {categories.map((category) => (
                <div 
                  key={category.id}
                  className="bg-[#F9F9F9] rounded-xl p-4 border border-[#E5E5EA]"
                >
                  <div className="space-y-3">
                    {/* Category Name */}
                    <div className="flex items-start gap-2">
                      <Input
                        value={category.name}
                        onChange={(e) => handleUpdateCategory(category.id, 'name', e.target.value)}
                        placeholder="e.g. Vendor, Date, Total"
                        className="flex-1 bg-white border border-[#E5E5EA] rounded-lg px-3 py-2 text-sm placeholder:text-[#6B6B6B] focus:border-[#E85C3C] focus:ring-0"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveCategory(category.id)}
                        className="w-9 h-9 text-red-600 hover:bg-red-50 rounded-lg flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Type and Required */}
                    <div className="flex items-center gap-3">
                      {/* Type Dropdown */}
                      <div className="flex-1">
                        <Select
                          value={category.type}
                          onValueChange={(value) => handleUpdateCategory(category.id, 'type', value)}
                        >
                          <SelectTrigger className="w-full bg-white border border-[#E5E5EA] rounded-lg h-9 text-sm focus:border-[#E85C3C] focus:ring-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Text">Text</SelectItem>
                            <SelectItem value="Number">Number</SelectItem>
                            <SelectItem value="Date">Date</SelectItem>
                            <SelectItem value="Currency">Currency</SelectItem>
                            <SelectItem value="Enum">Enum</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Required Toggle */}
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={category.required}
                          onCheckedChange={(checked) => handleUpdateCategory(category.id, 'required', checked)}
                          className="data-[state=checked]:bg-[#E85C3C]"
                        />
                        <span className="text-xs text-[#6B6B6B] font-medium whitespace-nowrap">
                          Required
                        </span>
                      </div>
                    </div>

                    {/* Advanced Options Toggle */}
                    <button
                      onClick={() => handleToggleAdvanced(category.id)}
                      className="flex items-center gap-1 text-xs text-[#E85C3C] font-semibold uppercase tracking-[0.1em] hover:opacity-70 transition-opacity"
                    >
                      <span>Advanced</span>
                      <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${category.showAdvanced ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Advanced Options Panel */}
                    {category.showAdvanced && (
                      <div className="bg-white rounded-lg p-3 border border-[#E5E5EA] space-y-3 mt-2">
                        <div>
                          <label className="block text-xs font-medium text-[#6B6B6B] mb-1.5">
                            OCR Parse From
                          </label>
                          <Input
                            placeholder="e.g. invoice_number, total_amount"
                            className="w-full bg-[#F9F9F9] border border-[#E5E5EA] rounded-lg px-3 py-2 text-sm placeholder:text-[#6B6B6B] focus:border-[#E85C3C] focus:ring-0"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#6B6B6B] mb-1.5">
                            Validation Rules
                          </label>
                          <Input
                            placeholder="e.g. min:0, max:1000"
                            className="w-full bg-[#F9F9F9] border border-[#E5E5EA] rounded-lg px-3 py-2 text-sm placeholder:text-[#6B6B6B] focus:border-[#E85C3C] focus:ring-0"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Category Button */}
          <Button
            onClick={handleAddCategory}
            variant="outline"
            className="w-full h-11 border-2 border-dashed border-[#E85C3C] text-[#E85C3C] hover:bg-[#E85C3C]/5 hover:border-solid active:bg-[#E85C3C]/10 rounded-xl font-semibold transition-all duration-150"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>

        {/* Section 3: Parse & Export */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#E5E5EA]">
          <h2 className="text-xs font-bold text-[#E85C3C] tracking-[0.1em] uppercase mb-4">
            PARSE & EXPORT
          </h2>

          <div className="space-y-4">
            {/* Auto-parse Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#1A1A1A] mb-1">
                  Auto-parse photos in this folder
                </p>
                <p className="text-xs text-[#6B6B6B] font-medium">
                  Automatically extract data from new documents
                </p>
              </div>
              <Switch
                checked={autoParse}
                onCheckedChange={setAutoParse}
                className="data-[state=checked]:bg-[#E85C3C] ml-4"
              />
            </div>

            {/* Divider */}
            <div className="h-px bg-[#E5E5EA]" />

            {/* Export Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#1A1A1A] mb-1">
                  Export to Google Sheets
                </p>
                <p className="text-xs text-[#6B6B6B] font-medium">
                  Sync extracted data to a spreadsheet
                </p>
              </div>
              <Switch
                checked={exportEnabled}
                onCheckedChange={setExportEnabled}
                className="data-[state=checked]:bg-[#E85C3C] ml-4"
              />
            </div>

            {/* Export Config Button */}
            {exportEnabled && (
              <Button
                variant="outline"
                className="w-full h-11 bg-[#F9F9F9] border border-[#E5E5EA] text-[#1A1A1A] hover:bg-white hover:border-[#E85C3C] active:bg-[#F2F2F7] rounded-xl font-medium transition-all duration-150"
              >
                Configure export destination
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E5EA] p-4 max-w-[393px] mx-auto">
        <div className="space-y-3">
          {/* Primary Button */}
          <Button
            onClick={handleSave}
            disabled={isSaving || !!nameError}
            className="w-full h-12 bg-[#E85C3C] hover:bg-[#D54B2A] active:bg-[#C24B2A] disabled:bg-[#E5E5EA] disabled:text-[#6B6B6B] text-white font-semibold rounded-xl transition-all duration-150"
          >
            {isSaving ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </div>
            ) : (
              'Save & Continue'
            )}
          </Button>

          {/* Secondary Link */}
          <button
            onClick={handleSkip}
            disabled={isSaving}
            className="w-full h-10 text-sm font-semibold text-[#E85C3C] hover:text-[#D54B2A] active:text-[#C24B2A] disabled:text-[#6B6B6B] transition-colors duration-150 uppercase tracking-[0.1em]"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
