import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/useCategories';
import { toast } from '@/components/ui/sonner';

export function CategoriesManager() {
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name_vi: '',
    name_en: '',
    slug: '',
  });

  const { data: categories, isLoading } = useCategories();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name_vi || !formData.name_en) {
      toast.error('Please fill in all required fields');
      return;
    }

    const categoryData = {
      ...formData,
      slug: formData.slug || generateSlug(formData.name_en),
    };

    try {
      if (editingCategory) {
        await updateCategoryMutation.mutateAsync({ id: editingCategory.id, ...categoryData });
        toast.success('Category updated successfully');
      } else {
        await createCategoryMutation.mutateAsync(categoryData);
        toast.success('Category created successfully');
      }
      
      setIsDialogOpen(false);
      setEditingCategory(null);
      setFormData({ name_vi: '', name_en: '', slug: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to save category');
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name_vi: category.name_vi,
      name_en: category.name_en,
      slug: category.slug,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (categoryId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await deleteCategoryMutation.mutateAsync(categoryId);
      toast.success('Category deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete category');
    }
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({ name_vi: '', name_en: '', slug: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">Categories</h2>
          <p className="text-muted-foreground">Manage blog categories</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Edit Category' : 'New Category'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name_vi">Vietnamese Name *</Label>
                <Input
                  id="name_vi"
                  value={formData.name_vi}
                  onChange={(e) => setFormData(prev => ({ ...prev, name_vi: e.target.value }))}
                  placeholder="Tên tiếng Việt"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="name_en">English Name *</Label>
                <Input
                  id="name_en"
                  value={formData.name_en}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData(prev => ({ 
                      ...prev, 
                      name_en: value,
                      slug: prev.slug || generateSlug(value)
                    }));
                  }}
                  placeholder="English name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="category-slug"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                >
                  {editingCategory ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Table */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vietnamese Name</TableHead>
                <TableHead>English Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No categories found
                  </TableCell>
                </TableRow>
              ) : (
                categories?.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name_vi}</TableCell>
                    <TableCell>{category.name_en}</TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {category.slug}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(category.id, category.name_vi)}
                          disabled={deleteCategoryMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}