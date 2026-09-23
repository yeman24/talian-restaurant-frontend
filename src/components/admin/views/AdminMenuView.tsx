import React, { useState } from 'react'
import {
  Search,
  CheckCircle2,
  Wine,
  Sparkles,
  Plus,
  Pencil,
  Trash2,
  X,
  Clock,
  Utensils,
  Layers,
  AlertTriangle,
  Star,
} from 'lucide-react'
import {
  useDishes,
  useCreateDish,
  useUpdateDish,
  useDeleteDish,
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useTastingMenus,
  useCreateTastingMenu,
  useUpdateTastingMenu,
  useDeleteTastingMenu,
} from '@/hooks/useDishes'
import { Skeleton } from '@/components/common/Skeleton'
import { Button } from '@/components/common/Button'
import { useToast } from '@/context/ToastContext'
import { formatCurrency } from '@/lib/utils'
import type {
  Dish,
  TastingMenu,
  Category,
  CreateDishPayload,
  CreateTastingMenuPayload,
  CreateCategoryPayload,
  DietaryTag,
} from '@/types'

type AtelierSubTab = 'dishes' | 'tasting-menus' | 'categories'

const DIETARY_OPTIONS: { id: DietaryTag; label: string }[] = [
  { id: 'gluten-free', label: 'Gluten Free' },
  { id: 'dairy-free', label: 'Dairy Free' },
  { id: 'pescatarian', label: 'Pescatarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'nut-free', label: 'Nut Free' },
]

export const AdminMenuView: React.FC = () => {
  const { toast } = useToast()
  const [subTab, setSubTab] = useState<AtelierSubTab>('dishes')
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')

  // Queries
  const { data: dishes, isLoading: isDishesLoading } = useDishes()
  const { data: categories, isLoading: isCategoriesLoading } = useCategories()
  const { data: tastingMenus, isLoading: isTastingMenusLoading } = useTastingMenus()

  // Mutations
  const createDishMutation = useCreateDish()
  const updateDishMutation = useUpdateDish()
  const deleteDishMutation = useDeleteDish()

  const createCategoryMutation = useCreateCategory()
  const updateCategoryMutation = useUpdateCategory()
  const deleteCategoryMutation = useDeleteCategory()

  const createTastingMenuMutation = useCreateTastingMenu()
  const updateTastingMenuMutation = useUpdateTastingMenu()
  const deleteTastingMenuMutation = useDeleteTastingMenu()

  // Modals state
  const [dishModalOpen, setDishModalOpen] = useState(false)
  const [editingDish, setEditingDish] = useState<Dish | null>(null)

  const [tastingMenuModalOpen, setTastingMenuModalOpen] = useState(false)
  const [editingTastingMenu, setEditingTastingMenu] = useState<TastingMenu | null>(null)

  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  // Delete Confirmation State
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'dish' | 'tasting-menu' | 'category'
    id: string
    name: string
  } | null>(null)

  // Dish Form State
  const [dishForm, setDishForm] = useState<CreateDishPayload>({
    name: '',
    gaelicName: '',
    categoryId: '',
    courseNumber: 1,
    description: '',
    story: '',
    provenance: '',
    price: 35,
    image: '/images/boer.jpg',
    isSignature: false,
    isChefRecommendation: false,
    winePairing: {
      name: '',
      producer: '',
      vintage: '',
      region: '',
      notes: '',
    },
    dietary: [],
    allergens: [],
  })

  // Tasting Menu Form State
  const [tastingMenuForm, setTastingMenuForm] = useState<CreateTastingMenuPayload>({
    title: '',
    subtitle: '',
    description: '',
    price: 175,
    pairingPrice: 115,
    prestigePairingPrice: 195,
    coursesCount: 8,
    duration: '3 hours',
    isActive: true,
    courses: [
      {
        number: 1,
        title: 'Hebridean Seaweed Brot',
        gaelicTitle: 'Brot Feamainn',
        description: 'Sourdough leavened for 48 hours with smoked peated butter',
        pairing: 'NV Billecart-Salmon Brut Rosé',
      },
    ],
  })

  // Category Form State
  const [categoryForm, setCategoryForm] = useState<CreateCategoryPayload>({
    name: '',
    slug: '',
    description: '',
    displayOrder: 1,
  })

  // --- Handlers: Dish ---
  const handleOpenCreateDish = () => {
    setEditingDish(null)
    const defaultCatId = categories && categories.length > 0 ? categories[0].id : 'tasting'
    setDishForm({
      name: '',
      gaelicName: '',
      categoryId: defaultCatId,
      courseNumber: (dishes?.length || 0) + 1,
      description: '',
      story: '',
      provenance: '',
      price: 35,
      image: '/images/boer.jpg',
      isSignature: false,
      isChefRecommendation: false,
      winePairing: {
        name: '',
        producer: '',
        vintage: '',
        region: '',
        notes: '',
      },
      dietary: [],
      allergens: [],
    })
    setDishModalOpen(true)
  }

  const handleOpenEditDish = (dish: Dish) => {
    setEditingDish(dish)
    const matchedCategory = categories?.find(
      (c) => c.id === dish.categoryId || c.slug === dish.category || c.name === dish.category
    )
    setDishForm({
      name: dish.name,
      gaelicName: dish.gaelicName || '',
      categoryId: matchedCategory ? matchedCategory.id : (dish.categoryId || dish.category),
      courseNumber: dish.courseNumber || 1,
      description: dish.description || '',
      story: dish.story || '',
      provenance: dish.provenance || '',
      price: dish.price,
      image: dish.image || '/images/boer.jpg',
      isSignature: Boolean(dish.isSignature),
      isChefRecommendation: Boolean(dish.isChefRecommendation),
      winePairing: dish.winePairing || {
        name: '',
        producer: '',
        vintage: '',
        region: '',
        notes: '',
      },
      dietary: dish.dietary || [],
      allergens: dish.allergens || [],
    })
    setDishModalOpen(true)
  }

  const handleSaveDish = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!dishForm.name || !dishForm.description || !dishForm.provenance) {
      toast({
        title: 'Required Fields Missing',
        message: 'Please provide course name, description, and terroir provenance.',
        type: 'error',
      })
      return
    }

    try {
      if (editingDish) {
        await updateDishMutation.mutateAsync({
          id: editingDish.id,
          data: dishForm,
        })
        toast({
          title: 'Dish Updated',
          message: `"${dishForm.name}" has been updated in the Atelier registry.`,
          type: 'success',
        })
      } else {
        await createDishMutation.mutateAsync(dishForm)
        toast({
          title: 'Dish Created',
          message: `"${dishForm.name}" was successfully added to the seasonal courses.`,
          type: 'success',
        })
      }
      setDishModalOpen(false)
    } catch (err: any) {
      toast({
        title: 'Dish Save Failed',
        message: err?.message || 'Could not save course.',
        type: 'error',
      })
    }
  }

  // --- Handlers: Tasting Menu ---
  const handleOpenCreateTastingMenu = () => {
    setEditingTastingMenu(null)
    setTastingMenuForm({
      title: '',
      subtitle: '',
      description: '',
      price: 175,
      pairingPrice: 115,
      prestigePairingPrice: 195,
      coursesCount: 8,
      duration: '3 hours',
      isActive: true,
      courses: [
        {
          number: 1,
          title: 'Hebridean Seaweed Brot',
          gaelicTitle: 'Brot Feamainn',
          description: 'Sourdough leavened for 48 hours with smoked peated butter',
          pairing: 'NV Billecart-Salmon Brut Rosé',
        },
      ],
    })
    setTastingMenuModalOpen(true)
  }

  const handleOpenEditTastingMenu = (menu: TastingMenu) => {
    setEditingTastingMenu(menu)
    setTastingMenuForm({
      title: menu.title,
      subtitle: menu.subtitle,
      description: menu.description,
      price: Number(menu.price),
      pairingPrice: Number(menu.pairingPrice),
      prestigePairingPrice: Number(menu.prestigePairingPrice || 195),
      coursesCount: menu.coursesCount || menu.courses.length,
      duration: menu.duration || '3 hours',
      isActive: menu.isActive ?? true,
      courses: menu.courses || [],
    })
    setTastingMenuModalOpen(true)
  }

  const handleSaveTastingMenu = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tastingMenuForm.title || !tastingMenuForm.subtitle || !tastingMenuForm.description) {
      toast({
        title: 'Missing Details',
        message: 'Please provide title, subtitle, and menu philosophy.',
        type: 'error',
      })
      return
    }

    try {
      if (editingTastingMenu) {
        await updateTastingMenuMutation.mutateAsync({
          id: editingTastingMenu.id,
          data: tastingMenuForm,
        })
        toast({
          title: 'Tasting Menu Updated',
          message: `"${tastingMenuForm.title}" degustation sequence has been updated.`,
          type: 'success',
        })
      } else {
        await createTastingMenuMutation.mutateAsync(tastingMenuForm)
        toast({
          title: 'Tasting Menu Created',
          message: `"${tastingMenuForm.title}" is now available in the Atelier.`,
          type: 'success',
        })
      }
      setTastingMenuModalOpen(false)
    } catch (err: any) {
      toast({
        title: 'Save Failed',
        message: err?.message || 'Could not save tasting menu.',
        type: 'error',
      })
    }
  }

  // --- Handlers: Categories ---
  const handleOpenCreateCategory = () => {
    setEditingCategory(null)
    setCategoryForm({
      name: '',
      slug: '',
      description: '',
      displayOrder: (categories?.length || 0) + 1,
    })
    setCategoryModalOpen(true)
  }

  const handleOpenEditCategory = (cat: Category) => {
    setEditingCategory(cat)
    setCategoryForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      displayOrder: cat.displayOrder || 1,
    })
    setCategoryModalOpen(true)
  }

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryForm.name) {
      toast({
        title: 'Name Required',
        message: 'Please enter category name.',
        type: 'error',
      })
      return
    }

    try {
      if (editingCategory) {
        await updateCategoryMutation.mutateAsync({
          id: editingCategory.id,
          data: categoryForm,
        })
        toast({
          title: 'Category Updated',
          message: `Category "${categoryForm.name}" updated successfully.`,
          type: 'success',
        })
      } else {
        await createCategoryMutation.mutateAsync(categoryForm)
        toast({
          title: 'Category Created',
          message: `Category "${categoryForm.name}" added to menu registry.`,
          type: 'success',
        })
      }
      setCategoryModalOpen(false)
    } catch (err: any) {
      toast({
        title: 'Category Save Failed',
        message: err?.message || 'Could not save category.',
        type: 'error',
      })
    }
  }

  // --- Execute Deletion ---
  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return
    const { type, id, name } = deleteConfirm

    try {
      if (type === 'dish') {
        await deleteDishMutation.mutateAsync(id)
        toast({
          title: 'Dish Removed',
          message: `"${name}" removed from the seasonal courses registry.`,
          type: 'success',
        })
      } else if (type === 'tasting-menu') {
        await deleteTastingMenuMutation.mutateAsync(id)
        toast({
          title: 'Tasting Menu Removed',
          message: `"${name}" removed from tasting offerings.`,
          type: 'success',
        })
      } else if (type === 'category') {
        await deleteCategoryMutation.mutateAsync(id)
        toast({
          title: 'Category Removed',
          message: `Category "${name}" deleted.`,
          type: 'success',
        })
      }
      setDeleteConfirm(null)
    } catch (err: any) {
      toast({
        title: 'Deletion Failed',
        message: err?.message || 'Unable to delete item.',
        type: 'error',
      })
    }
  }

  // Filtered dishes
  const filteredDishes = (dishes || []).filter((dish: Dish) => {
    if (selectedCategory !== 'ALL') {
      const matchSlug = dish.category.toLowerCase() === selectedCategory.toLowerCase()
      const matchCatId = dish.categoryId === selectedCategory
      if (!matchSlug && !matchCatId) return false
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      return (
        dish.name.toLowerCase().includes(q) ||
        dish.description?.toLowerCase().includes(q) ||
        dish.provenance?.toLowerCase().includes(q) ||
        dish.gaelicName?.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <div className="space-y-6 select-none font-sans">
      {/* Atelier Navigation Banner */}
      <div className="bg-white border border-[#e2d7ba] rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#c5a059] font-semibold">
                Culinary Atelier
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-xs text-stone-500 font-mono">Two Michelin Stars ✦</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#12141a] font-normal mt-1">
              Menu & Course Atelier
            </h2>
            <p className="text-xs text-stone-600 font-light mt-1">
              Curate seasonal degustations, Highland terroir provenance, and sommelier pairings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {subTab === 'dishes' && (
              <Button
                variant="gold"
                size="sm"
                onClick={handleOpenCreateDish}
                leftIcon={<Plus className="w-4 h-4" />}
                className="bg-[#12141a] text-[#fcf5df] hover:bg-[#232836] text-xs py-2 px-4 shadow-sm"
              >
                Add Seasonal Course
              </Button>
            )}

            {subTab === 'tasting-menus' && (
              <Button
                variant="gold"
                size="sm"
                onClick={handleOpenCreateTastingMenu}
                leftIcon={<Plus className="w-4 h-4" />}
                className="bg-[#12141a] text-[#fcf5df] hover:bg-[#232836] text-xs py-2 px-4 shadow-sm"
              >
                Create Tasting Menu
              </Button>
            )}

            {subTab === 'categories' && (
              <Button
                variant="gold"
                size="sm"
                onClick={handleOpenCreateCategory}
                leftIcon={<Plus className="w-4 h-4" />}
                className="bg-[#12141a] text-[#fcf5df] hover:bg-[#232836] text-xs py-2 px-4 shadow-sm"
              >
                Add Category
              </Button>
            )}
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#ede3c9] pb-3">
          <button
            onClick={() => setSubTab('dishes')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
              subTab === 'dishes'
                ? 'bg-[#12141a] text-[#fcf5df] font-bold shadow-sm'
                : 'text-stone-600 hover:text-[#12141a] hover:bg-[#fcf5df]'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Seasonal Courses ({dishes?.length ?? 0})</span>
          </button>

          <button
            onClick={() => setSubTab('tasting-menus')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
              subTab === 'tasting-menus'
                ? 'bg-[#12141a] text-[#fcf5df] font-bold shadow-sm'
                : 'text-stone-600 hover:text-[#12141a] hover:bg-[#fcf5df]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Tasting Menus ({tastingMenus?.length ?? 0})</span>
          </button>

          <button
            onClick={() => setSubTab('categories')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
              subTab === 'categories'
                ? 'bg-[#12141a] text-[#fcf5df] font-bold shadow-sm'
                : 'text-stone-600 hover:text-[#12141a] hover:bg-[#fcf5df]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Course Categories ({categories?.length ?? 0})</span>
          </button>
        </div>

        {/* Search & Category Filter for Dishes */}
        {subTab === 'dishes' && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <div className="w-full sm:w-80 relative">
              <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search dishes, wild herbs, cuts, Gaelic..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#fcf5df] border border-[#dcd2b7] focus:border-[#12141a] rounded-lg pl-8 pr-3 py-2 text-xs text-[#12141a] placeholder-stone-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer shrink-0 ${
                  selectedCategory === 'ALL'
                    ? 'bg-[#12141a] text-[#fcf5df] font-bold'
                    : 'bg-[#fcf5df] text-[#12141a] hover:bg-[#f3e6c6] border border-[#dcd2b7]'
                }`}
              >
                ALL COURSES
              </button>
              {(categories || []).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer shrink-0 ${
                    selectedCategory.toLowerCase() === cat.slug.toLowerCase()
                      ? 'bg-[#12141a] text-[#fcf5df] font-bold'
                      : 'bg-[#fcf5df] text-[#12141a] hover:bg-[#f3e6c6] border border-[#dcd2b7]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 1. COURSES & DISHES VIEW */}
      {/* ========================================================================= */}
      {subTab === 'dishes' && (
        <>
          {isDishesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-80 w-full rounded-2xl" />
              ))}
            </div>
          ) : filteredDishes.length === 0 ? (
            <div className="bg-white border border-[#e2d7ba] rounded-2xl p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#fcf5df] border border-[#e2d7ba] text-[#c5a059] flex items-center justify-center mx-auto">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-[#12141a]">No Seasonal Courses Found</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                No courses match your current search query or category filter. Add a new seasonal course or adjust your filters.
              </p>
              <Button
                variant="gold"
                size="sm"
                onClick={handleOpenCreateDish}
                className="bg-[#12141a] text-[#fcf5df] hover:bg-[#232836] text-xs py-2 px-4"
              >
                Add Seasonal Course
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDishes.map((dish: Dish) => (
                <div
                  key={dish.id}
                  className="bg-white border border-[#e2d7ba] rounded-2xl p-5 shadow-sm hover:border-[#12141a] transition-all flex flex-col justify-between text-[#12141a] group relative"
                >
                  <div className="space-y-3">
                    {/* Badges & Course # */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[9px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-[#12141a] text-[#fcf5df] font-bold">
                          {dish.category}
                        </span>
                        {dish.courseNumber && (
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#fcf5df] border border-[#e2d7ba] text-[#12141a] font-medium">
                            Course {dish.courseNumber}
                          </span>
                        )}
                        {dish.isSignature && (
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-semibold flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> Signature
                          </span>
                        )}
                      </div>

                      <span className="font-mono text-base text-[#12141a] font-bold">
                        {formatCurrency(dish.price)}
                      </span>
                    </div>

                    {/* Dish Title & Gaelic Name */}
                    <div>
                      <h4 className="font-serif text-lg text-[#12141a] font-medium leading-snug">
                        {dish.name}
                      </h4>
                      {dish.gaelicName && (
                        <span className="text-[11px] text-stone-500 italic block mt-0.5 font-serif">
                          {dish.gaelicName}
                        </span>
                      )}
                    </div>

                    {/* Image Preview Banner */}
                    {dish.image && (
                      <div className="h-32 rounded-xl overflow-hidden bg-stone-100 relative">
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            ;(e.target as HTMLElement).style.display = 'none'
                          }}
                        />
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-xs text-stone-600 font-light leading-relaxed line-clamp-2">
                      {dish.description}
                    </p>

                    {/* Provenance */}
                    {dish.provenance && (
                      <div className="text-[11px] text-stone-700 font-mono flex items-center gap-1.5 p-2 rounded-lg bg-[#fcf5df] border border-[#e2d7ba]">
                        <Sparkles className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
                        <span className="truncate">{dish.provenance}</span>
                      </div>
                    )}

                    {/* Wine Pairing */}
                    {dish.winePairing && (dish.winePairing.name || dish.winePairing.vintage) && (
                      <div className="text-[11px] text-stone-700 font-sans flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-200">
                        <Wine className="w-3.5 h-3.5 shrink-0 text-[#c5a059]" />
                        <span className="truncate font-medium">
                          {dish.winePairing.name} {dish.winePairing.vintage ? `(${dish.winePairing.vintage})` : ''}
                        </span>
                      </div>
                    )}

                    {/* Dietary Tags */}
                    {dish.dietary && dish.dietary.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {dish.dietary.map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-4 mt-4 border-t border-[#ede3c9] flex items-center justify-between">
                    <span className="text-emerald-700 font-mono text-[10px] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Active Dish
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditDish(dish)}
                        className="p-1.5 rounded-lg text-stone-600 hover:text-[#12141a] hover:bg-[#fcf5df] border border-stone-200 transition-colors cursor-pointer"
                        title="Edit Dish"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() =>
                          setDeleteConfirm({
                            type: 'dish',
                            id: dish.id,
                            name: dish.name,
                          })
                        }
                        className="p-1.5 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                        title="Delete Dish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* 2. TASTING MENUS VIEW */}
      {/* ========================================================================= */}
      {subTab === 'tasting-menus' && (
        <>
          {isTastingMenusLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-80 w-full rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {(tastingMenus || []).map((menu: TastingMenu) => (
                <div
                  key={menu.id}
                  className="bg-white border border-[#e2d7ba] rounded-2xl p-6 shadow-sm hover:border-[#12141a] transition-all flex flex-col justify-between text-[#12141a]"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#12141a] text-[#fcf5df] font-bold">
                            {menu.coursesCount || menu.courses.length} Courses
                          </span>
                          <span className="text-[10px] font-mono text-stone-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {menu.duration || '3 hours'}
                          </span>
                        </div>
                        <h3 className="font-serif text-2xl text-[#12141a] font-normal mt-2">
                          {menu.title}
                        </h3>
                        <p className="text-xs text-[#c5a059] font-mono font-medium mt-0.5">
                          {menu.subtitle}
                        </p>
                      </div>

                      <div className="text-right font-mono">
                        <div className="text-lg font-bold text-[#12141a]">
                          {formatCurrency(Number(menu.price))}
                        </div>
                        <div className="text-[10px] text-stone-500">
                          Pairing: +{formatCurrency(Number(menu.pairingPrice))}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 font-light leading-relaxed">
                      {menu.description}
                    </p>

                    {/* Courses Sequence Breakdown */}
                    <div className="space-y-2 pt-2 border-t border-[#ede3c9]">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold block">
                        Sequential Course Breakdown:
                      </span>
                      <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                        {(menu.courses || []).map((course, idx) => (
                          <div
                            key={idx}
                            className="flex items-start justify-between gap-2 p-2 rounded-lg bg-[#fcf5df]/60 border border-[#e2d7ba]/60 text-xs"
                          >
                            <div className="flex items-start gap-2">
                              <span className="font-mono text-[10px] font-bold text-[#c5a059] px-1.5 py-0.5 rounded bg-white border border-[#e2d7ba]">
                                #{course.number || idx + 1}
                              </span>
                              <div>
                                <span className="font-medium text-[#12141a] block">
                                  {course.title}
                                </span>
                                {course.pairing && (
                                  <span className="text-[10px] text-stone-500 font-mono flex items-center gap-1 mt-0.5">
                                    <Wine className="w-3 h-3 text-[#c5a059]" /> {course.pairing}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-4 mt-6 border-t border-[#ede3c9] flex items-center justify-between">
                    <span className="text-emerald-700 font-mono text-[10px] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Active Degustation
                    </span>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEditTastingMenu(menu)}
                        leftIcon={<Pencil className="w-3.5 h-3.5" />}
                        className="text-xs border-[#dcd2b7] text-[#12141a] hover:bg-[#fcf5df]"
                      >
                        Edit Menu
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setDeleteConfirm({
                            type: 'tasting-menu',
                            id: menu.id,
                            name: menu.title,
                          })
                        }
                        leftIcon={<Trash2 className="w-3.5 h-3.5 text-rose-600" />}
                        className="text-xs border-rose-200 text-rose-700 hover:bg-rose-50"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* 3. COURSE CATEGORIES VIEW */}
      {/* ========================================================================= */}
      {subTab === 'categories' && (
        <>
          {isCategoriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-44 w-full rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(categories || []).map((cat: Category) => (
                <div
                  key={cat.id}
                  className="bg-white border border-[#e2d7ba] rounded-2xl p-6 shadow-sm hover:border-[#12141a] transition-all flex flex-col justify-between text-[#12141a]"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#fcf5df] text-[#12141a] border border-[#e2d7ba] font-bold">
                          Order #{cat.displayOrder}
                        </span>
                        <h4 className="font-serif text-xl text-[#12141a] font-medium mt-2">
                          {cat.name}
                        </h4>
                        <span className="text-xs font-mono text-stone-500 block">
                          slug: {cat.slug}
                        </span>
                      </div>

                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#12141a] text-[#fcf5df]">
                        {cat._count?.dishes ?? 0} dishes
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 font-light leading-relaxed">
                      {cat.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="pt-4 mt-6 border-t border-[#ede3c9] flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEditCategory(cat)}
                      leftIcon={<Pencil className="w-3.5 h-3.5" />}
                      className="text-xs border-[#dcd2b7] text-[#12141a] hover:bg-[#fcf5df]"
                    >
                      Edit
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setDeleteConfirm({
                          type: 'category',
                          id: cat.id,
                          name: cat.name,
                        })
                      }
                      leftIcon={<Trash2 className="w-3.5 h-3.5 text-rose-600" />}
                      className="text-xs border-rose-200 text-rose-700 hover:bg-rose-50"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DISH CREATE / EDIT */}
      {/* ========================================================================= */}
      {dishModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#e2d7ba] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
            <div className="p-6 border-b border-[#ede3c9] flex items-center justify-between bg-[#fcf5df]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c5a059] font-bold">
                  Atelier Course Curation
                </span>
                <h3 className="font-serif text-xl text-[#12141a]">
                  {editingDish ? `Edit Course: ${editingDish.name}` : 'Add New Seasonal Course'}
                </h3>
              </div>
              <button
                onClick={() => setDishModalOpen(false)}
                className="p-1 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-[#ede3c9] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDish} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-700 mb-1 font-semibold">
                    Course Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hand-Dived Orkney Scallop"
                    value={dishForm.name}
                    onChange={(e) => setDishForm({ ...dishForm, name: e.target.value })}
                    className="w-full bg-[#fcf5df] border border-[#dcd2b7] focus:border-[#12141a] rounded-lg px-3 py-2 text-xs text-[#12141a] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-700 mb-1 font-semibold">
                    Gaelic Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sgàilleag Arcaibh"
                    value={dishForm.gaelicName}
                    onChange={(e) => setDishForm({ ...dishForm, gaelicName: e.target.value })}
                    className="w-full bg-[#fcf5df] border border-[#dcd2b7] focus:border-[#12141a] rounded-lg px-3 py-2 text-xs text-[#12141a] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-700 mb-1 font-semibold">
                    Category *
                  </label>
                  <select
                    value={dishForm.categoryId}
                    onChange={(e) => setDishForm({ ...dishForm, categoryId: e.target.value })}
                    className="w-full bg-[#fcf5df] border border-[#dcd2b7] focus:border-[#12141a] rounded-lg px-3 py-2 text-xs text-[#12141a] focus:outline-none"
                  >
                    {(categories || []).map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name} ({cat.slug})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-700 mb-1 font-semibold">
                      Course #
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={dishForm.courseNumber || 1}
                      onChange={(e) =>
                        setDishForm({ ...dishForm, courseNumber: Number(e.target.value) })
                      }
                      className="w-full bg-[#fcf5df] border border-[#dcd2b7] focus:border-[#12141a] rounded-lg px-3 py-2 text-xs text-[#12141a] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-700 mb-1 font-semibold">
                      Price (£) *
                    </label>
                    <input
                      type="number"
                      min={0}
                      step="1"
                      required
                      value={dishForm.price}
                      onChange={(e) => setDishForm({ ...dishForm, price: Number(e.target.value) })}
                      className="w-full bg-[#fcf5df] border border-[#dcd2b7] focus:border-[#12141a] rounded-lg px-3 py-2 text-xs text-[#12141a] focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-700 mb-1 font-semibold">
                  Terroir Provenance *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scapa Flow, Orkney Islands (Hand-dived by Kevin MacLeod)"
                  value={dishForm.provenance}
                  onChange={(e) => setDishForm({ ...dishForm, provenance: e.target.value })}
                  className="w-full bg-[#fcf5df] border border-[#dcd2b7] focus:border-[#12141a] rounded-lg px-3 py-2 text-xs text-[#12141a] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-700 mb-1 font-semibold">
                  Course Description *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Lightly torched Orkney scallop with smoked bone marrow dashi and sea herbs..."
                  value={dishForm.description}
                  onChange={(e) => setDishForm({ ...dishForm, description: e.target.value })}
                  className="w-full bg-[#fcf5df] border border-[#dcd2b7] focus:border-[#12141a] rounded-lg p-2.5 text-xs text-[#12141a] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-700 mb-1 font-semibold">
                  Culinary Story & Philosophy
                </label>
                <textarea
                  rows={2}
                  placeholder="Harvested in the freezing tidal flows, highlighting pure Scottish marine terroir..."
                  value={dishForm.story}
                  onChange={(e) => setDishForm({ ...dishForm, story: e.target.value })}
                  className="w-full bg-[#fcf5df] border border-[#dcd2b7] focus:border-[#12141a] rounded-lg p-2.5 text-xs text-[#12141a] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-700 mb-1 font-semibold">
                  Image URL / Asset Path
                </label>
                <input
                  type="text"
                  value={dishForm.image}
                  onChange={(e) => setDishForm({ ...dishForm, image: e.target.value })}
                  className="w-full bg-[#fcf5df] border border-[#dcd2b7] focus:border-[#12141a] rounded-lg px-3 py-2 text-xs text-[#12141a] focus:outline-none font-mono"
                />
              </div>

              {/* Wine Pairing Subsection */}
              <div className="pt-3 border-t border-[#ede3c9] space-y-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#c5a059] font-bold block">
                  Sommelier Wine Pairing:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Wine Name (e.g. Puligny-Montrachet 1er Cru)"
                    value={dishForm.winePairing?.name || ''}
                    onChange={(e) =>
                      setDishForm({
                        ...dishForm,
                        winePairing: {
                          ...(dishForm.winePairing || { producer: '', vintage: '', region: '', notes: '' }),
                          name: e.target.value,
                        },
                      })
                    }
                    className="bg-[#fcf5df] border border-[#dcd2b7] focus:border-[#12141a] rounded-lg px-3 py-1.5 text-xs text-[#12141a] focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Producer (e.g. Domaine Alain Chavy)"
                    value={dishForm.winePairing?.producer || ''}
                    onChange={(e) =>
                      setDishForm({
                        ...dishForm,
                        winePairing: {
                          ...(dishForm.winePairing || { name: '', vintage: '', region: '', notes: '' }),
                          producer: e.target.value,
                        },
                      })
                    }
                    className="bg-[#fcf5df] border border-[#dcd2b7] focus:border-[#12141a] rounded-lg px-3 py-1.5 text-xs text-[#12141a] focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Vintage (e.g. 2020)"
                    value={dishForm.winePairing?.vintage || ''}
                    onChange={(e) =>
                      setDishForm({
                        ...dishForm,
                        winePairing: {
                          ...(dishForm.winePairing || { name: '', producer: '', region: '', notes: '' }),
                          vintage: e.target.value,
                        },
                      })
                    }
                    className="bg-[#fcf5df] border border-[#dcd2b7] focus:border-[#12141a] rounded-lg px-3 py-1.5 text-xs text-[#12141a] focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Region (e.g. Burgundy, France)"
                    value={dishForm.winePairing?.region || ''}
                    onChange={(e) =>
                      setDishForm({
                        ...dishForm,
                        winePairing: {
                          ...(dishForm.winePairing || { name: '', producer: '', vintage: '', notes: '' }),
                          region: e.target.value,
                        },
                      })
                    }
                    className="bg-[#fcf5df] border border-[#dcd2b7] focus:border-[#12141a] rounded-lg px-3 py-1.5 text-xs text-[#12141a] focus:outline-none"
                  />
                </div>
              </div>

              {/* Dietary Tags Checklist */}
              <div className="pt-3 border-t border-[#ede3c9] space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-stone-700 font-bold block">
                  Dietary Accommodations:
                </span>
                <div className="flex flex-wrap gap-2">
                  {DIETARY_OPTIONS.map((opt) => {
                    const isChecked = dishForm.dietary?.includes(opt.id)
                    return (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => {
                          const current = dishForm.dietary || []
                          const updated = isChecked
                            ? current.filter((t) => t !== opt.id)
                            : [...current, opt.id]
                          setDishForm({ ...dishForm, dietary: updated })
                        }}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-mono transition-colors cursor-pointer ${
                          isChecked
                            ? 'bg-[#12141a] text-[#fcf5df] font-bold'
                            : 'bg-[#fcf5df] text-stone-700 border border-[#dcd2b7]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Flags */}
              <div className="flex items-center gap-6 pt-3 border-t border-[#ede3c9]">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={dishForm.isSignature}
                    onChange={(e) => setDishForm({ ...dishForm, isSignature: e.target.checked })}
                    className="rounded border-[#dcd2b7] text-[#12141a] focus:ring-0 cursor-pointer"
                  />
                  <span>Signature Dish</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={dishForm.isChefRecommendation}
                    onChange={(e) =>
                      setDishForm({ ...dishForm, isChefRecommendation: e.target.checked })
                    }
                    className="rounded border-[#dcd2b7] text-[#12141a] focus:ring-0 cursor-pointer"
                  />
                  <span>Chef Recommendation</span>
                </label>
              </div>

              <div className="pt-6 border-t border-[#ede3c9] flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDishModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="gold"
                  isLoading={createDishMutation.isPending || updateDishMutation.isPending}
                  className="bg-[#12141a] text-[#fcf5df] hover:bg-[#232836] text-xs py-2 px-5 font-bold"
                >
                  {editingDish ? 'Update Course' : 'Create Course'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TASTING MENU CREATE / EDIT */}
      {/* ========================================================================= */}
      {tastingMenuModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#e2d7ba] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
            <div className="p-6 border-b border-[#ede3c9] flex items-center justify-between bg-[#fcf5df]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c5a059] font-bold">
                  Degustation Experience
                </span>
                <h3 className="font-serif text-xl text-[#12141a]">
                  {editingTastingMenu
                    ? `Edit Degustation: ${editingTastingMenu.title}`
                    : 'Create New Tasting Menu'}
                </h3>
              </div>
              <button
                onClick={() => setTastingMenuModalOpen(false)}
                className="p-1 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-[#ede3c9] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTastingMenu} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-700 mb-1 font-semibold">
                    Menu Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="The Autumn Terroir"
                    value={tastingMenuForm.title}
                    onChange={(e) =>
                      setTastingMenuForm({ ...tastingMenuForm, title: e.target.value })
                    }
                    className="w-full bg-[#fcf5df] border border-[#dcd2b7] focus:border-[#12141a] rounded-lg px-3 py-2 text-xs text-[#12141a] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-700 mb-1 font-semibold">
                    Subtitle *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="An 8-course odyssey celebrating Scotland’s rivers..."
                    value={tastingMenuForm.subtitle}
                    onChange={(e) =>
                      setTastingMenuForm({ ...tastingMenuForm, subtitle: e.target.value })
                    }
                    className="w-full bg-[#fcf5df] border border-[#dcd2b7] focus:border-[#12141a] rounded-lg px-3 py-2 text-xs text-[#12141a] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-700 mb-1 font-semibold">
                    Base Degustation Price (£) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={tastingMenuForm.price}
                    onChange={(e) =>
                      setTastingMenuForm({ ...tastingMenuForm, price: Number(e.target.value) })
                    }
                    className="w-full bg-[#fcf5df] border border-[#dcd2b7] focus:border-[#12141a] rounded-lg px-3 py-2 text-xs text-[#12141a] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-700 mb-1 font-semibold">
                    Sommelier Wine Pairing Price (£)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={tastingMenuForm.pairingPrice}
                    onChange={(e) =>
                      setTastingMenuForm({
                        ...tastingMenuForm,
                        pairingPrice: Number(e.target.value),
                      })
                    }
                    className="w-full bg-[#fcf5df] border border-[#dcd2b7] focus:border-[#12141a] rounded-lg px-3 py-2 text-xs text-[#12141a] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-700 mb-1 font-semibold">
                  Degustation Philosophy & Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={tastingMenuForm.description}
                  onChange={(e) =>
                    setTastingMenuForm({ ...tastingMenuForm, description: e.target.value })
                  }
                  className="w-full bg-[#fcf5df] border border-[#dcd2b7] focus:border-[#12141a] rounded-lg p-2.5 text-xs text-[#12141a] focus:outline-none"
                />
              </div>

              {/* Courses Breakdown Sequence */}
              <div className="pt-3 border-t border-[#ede3c9] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#c5a059] font-bold">
                    Course Sequence ({tastingMenuForm.courses.length} courses)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const nextNumber = tastingMenuForm.courses.length + 1
                      setTastingMenuForm({
                        ...tastingMenuForm,
                        coursesCount: nextNumber,
                        courses: [
                          ...tastingMenuForm.courses,
                          {
                            number: nextNumber,
                            title: `Course ${nextNumber}`,
                            description: '',
                            pairing: '',
                          },
                        ],
                      })
                    }}
                    className="text-[10px] font-mono px-2 py-1 rounded bg-[#fcf5df] hover:bg-[#ede3c9] border border-[#dcd2b7] text-[#12141a] font-bold cursor-pointer"
                  >
                    + Add Course Row
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {tastingMenuForm.courses.map((course, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-2 p-2.5 rounded-lg bg-[#fcf5df] border border-[#dcd2b7] items-center text-xs"
                    >
                      <div className="col-span-1 text-center font-mono font-bold text-[#c5a059]">
                        #{course.number || idx + 1}
                      </div>
                      <div className="col-span-5">
                        <input
                          type="text"
                          placeholder="Dish Title"
                          value={course.title}
                          onChange={(e) => {
                            const updated = [...tastingMenuForm.courses]
                            updated[idx].title = e.target.value
                            setTastingMenuForm({ ...tastingMenuForm, courses: updated })
                          }}
                          className="w-full bg-white border border-[#dcd2b7] rounded px-2 py-1 text-xs"
                        />
                      </div>
                      <div className="col-span-5">
                        <input
                          type="text"
                          placeholder="Wine Pairing"
                          value={course.pairing}
                          onChange={(e) => {
                            const updated = [...tastingMenuForm.courses]
                            updated[idx].pairing = e.target.value
                            setTastingMenuForm({ ...tastingMenuForm, courses: updated })
                          }}
                          className="w-full bg-white border border-[#dcd2b7] rounded px-2 py-1 text-xs"
                        />
                      </div>
                      <div className="col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = tastingMenuForm.courses.filter((_, i) => i !== idx)
                            setTastingMenuForm({
                              ...tastingMenuForm,
                              coursesCount: updated.length,
                              courses: updated,
                            })
                          }}
                          className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-[#ede3c9] flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setTastingMenuModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="gold"
                  isLoading={
                    createTastingMenuMutation.isPending || updateTastingMenuMutation.isPending
                  }
                  className="bg-[#12141a] text-[#fcf5df] hover:bg-[#232836] text-xs py-2 px-5 font-bold"
                >
                  {editingTastingMenu ? 'Update Tasting Menu' : 'Create Tasting Menu'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CATEGORY CREATE / EDIT */}
      {/* ========================================================================= */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#e2d7ba] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-[#ede3c9] flex items-center justify-between bg-[#fcf5df]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c5a059] font-bold">
                  Course Taxonomy
                </span>
                <h3 className="font-serif text-xl text-[#12141a]">
                  {editingCategory ? `Edit: ${editingCategory.name}` : 'Add Course Category'}
                </h3>
              </div>
              <button
                onClick={() => setCategoryModalOpen(false)}
                className="p-1 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-[#ede3c9] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-700 mb-1 font-semibold">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Highland & Coastal À La Carte"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full bg-[#fcf5df] border border-[#dcd2b7] focus:border-[#12141a] rounded-lg px-3 py-2 text-xs text-[#12141a] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-700 mb-1 font-semibold">
                  Slug
                </label>
                <input
                  type="text"
                  placeholder="e.g. alacarte (auto-generated if blank)"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                  className="w-full bg-[#fcf5df] border border-[#dcd2b7] focus:border-[#12141a] rounded-lg px-3 py-2 text-xs text-[#12141a] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-700 mb-1 font-semibold">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Sequential degustation or individual courses..."
                  value={categoryForm.description}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, description: e.target.value })
                  }
                  className="w-full bg-[#fcf5df] border border-[#dcd2b7] focus:border-[#12141a] rounded-lg p-2.5 text-xs text-[#12141a] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-700 mb-1 font-semibold">
                  Display Order
                </label>
                <input
                  type="number"
                  min={1}
                  value={categoryForm.displayOrder}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, displayOrder: Number(e.target.value) })
                  }
                  className="w-full bg-[#fcf5df] border border-[#dcd2b7] focus:border-[#12141a] rounded-lg px-3 py-2 text-xs text-[#12141a] focus:outline-none font-mono"
                />
              </div>

              <div className="pt-4 border-t border-[#ede3c9] flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCategoryModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="gold"
                  isLoading={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                  className="bg-[#12141a] text-[#fcf5df] hover:bg-[#232836] text-xs py-2 px-5 font-bold"
                >
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION DIALOG */}
      {/* ========================================================================= */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-rose-200 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 border border-rose-200 text-rose-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h4 className="font-serif text-xl text-[#12141a]">Confirm Deletion</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Are you sure you want to permanently remove{' '}
                <span className="font-bold text-[#12141a]">"{deleteConfirm.name}"</span>? This
                action cannot be undone and will immediately affect the active dining registry.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteConfirm(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleConfirmDelete}
                isLoading={
                  deleteDishMutation.isPending ||
                  deleteTastingMenuMutation.isPending ||
                  deleteCategoryMutation.isPending
                }
                className="bg-rose-600 text-white hover:bg-rose-700 border-rose-600 text-xs px-4"
              >
                Delete Permanently
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
