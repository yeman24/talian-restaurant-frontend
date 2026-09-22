import React, { useState } from 'react'
import { UploadCloud, Layers } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Skeleton } from '@/components/common/Skeleton'
import { useGallery, useUploadGalleryImage } from '@/hooks/useDishes'
import { useToast } from '@/context/ToastContext'
import type { GalleryItem } from '@/types'

export const AdminMediaView: React.FC = () => {
  const { toast } = useToast()
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const { data: galleryItems, isLoading: isGalleryLoading } = useGallery(
    selectedCategory === 'ALL' ? undefined : selectedCategory
  )
  const uploadImageMutation = useUploadGalleryImage()

  // Form state
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadCategory, setUploadCategory] = useState('CULINARY')
  const [uploadCaption, setUploadCaption] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setUploadFile(file)
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFilePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setFilePreview(null)
    }
  }

  const handleGalleryUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadFile || !uploadTitle) {
      toast({
        title: 'Missing Required Fields',
        message: 'Please provide both an image asset and a title.',
        type: 'error',
      })
      return
    }

    try {
      await uploadImageMutation.mutateAsync({
        file: uploadFile,
        title: uploadTitle,
        category: uploadCategory,
        caption: uploadCaption,
      })
      toast({
        title: 'Media Asset Published',
        message: `"${uploadTitle}" has been uploaded to Cloudinary and synchronized with the gallery.`,
        type: 'success',
      })
      setUploadFile(null)
      setFilePreview(null)
      setUploadTitle('')
      setUploadCaption('')
    } catch (err: any) {
      toast({
        title: 'Upload Encountered an Issue',
        message: err.message || 'Could not complete Cloudinary media upload.',
        type: 'error',
      })
    }
  }

  return (
    <div className="space-y-8">
      {/* Top Split: Upload Card & Asset Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Upload Form Card (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#e2d7ba] rounded-xl p-6 shadow-sm space-y-6">
          <div className="border-b border-[#e2d7ba] pb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#12141a] font-bold">
                Asset Pipeline
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <h3 className="font-serif text-2xl text-[#12141a] font-normal">
              Publish Media to Cloudinary Archive
            </h3>
            <p className="text-xs text-stone-500 font-light mt-1">
              High-resolution photography for culinary courses, sommelier reserves, and vault ambiance.
            </p>
          </div>

          <form onSubmit={handleGalleryUpload} className="space-y-5">
            {/* File Drop / Preview Zone */}
            <div>
              <label className="block text-[11px] uppercase font-mono tracking-wider text-stone-700 mb-1.5 font-semibold">
                Image Asset (JPG, PNG, WebP) *
              </label>
              <div className="border-2 border-dashed border-[#dcd2b7] hover:border-[#12141a] rounded-xl p-4 text-center transition-colors bg-[#fcf5df]">
                {filePreview ? (
                  <div className="space-y-3">
                    <img
                      loading="lazy"
                      src={filePreview}
                      alt="Upload preview"
                      className="w-full h-44 object-cover rounded-lg border border-[#e2d7ba]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setUploadFile(null)
                        setFilePreview(null)
                      }}
                      className="text-xs text-rose-600 hover:text-rose-800 font-mono font-medium"
                    >
                      Remove & Choose Different File
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block py-4">
                    <UploadCloud className="w-8 h-8 text-stone-600 mx-auto mb-2" />
                    <span className="text-xs text-[#12141a] font-semibold block">
                      Click to browse or drop an asset here
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono block mt-1">
                      Max file size 10MB • Auto WebP optimized
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase font-mono tracking-wider text-stone-700 mb-1 font-semibold">
                  Asset Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Highlands Wood Pigeon Plating"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full bg-[#fcf5df] border border-[#dcd2b7] focus:border-[#12141a] rounded-lg px-3 py-2 text-xs text-[#12141a] placeholder-stone-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-mono tracking-wider text-stone-700 mb-1 font-semibold">
                  Archive Category
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full bg-[#fcf5df] border border-[#dcd2b7] focus:border-[#12141a] rounded-lg px-3 py-2 text-xs text-[#12141a] focus:outline-none cursor-pointer font-medium"
                >
                  <option value="CULINARY">Plated Artistry (Culinary)</option>
                  <option value="AMBIANCE">Dining Room & Vaults</option>
                  <option value="CELLAR">Sommelier Cellar</option>
                  <option value="KITCHEN">Kitchen Brigade & Forage</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase font-mono tracking-wider text-stone-700 mb-1 font-semibold">
                Curatorial Caption / Story
              </label>
              <textarea
                rows={2}
                placeholder="Notes on terroir, seasonal forage origin, or sommelier vintage notes..."
                value={uploadCaption}
                onChange={(e) => setUploadCaption(e.target.value)}
                className="w-full bg-[#fcf5df] border border-[#dcd2b7] focus:border-[#12141a] rounded-lg px-3 py-2 text-xs text-[#12141a] placeholder-stone-400 focus:outline-none"
              />
            </div>

            <Button
              type="submit"
              variant="secondary"
              size="md"
              isLoading={uploadImageMutation.isPending}
              leftIcon={<UploadCloud className="w-4 h-4" />}
              className="w-full justify-center text-xs tracking-wider uppercase font-bold bg-[#12141a] text-[#fcf5df] hover:bg-[#202532] shadow-sm"
            >
              Upload to Cloudinary CDN
            </Button>
          </form>
        </div>

        {/* Cloudinary Integration Stats (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#e2d7ba] rounded-xl p-6 shadow-sm space-y-4">
            <h4 className="font-serif text-lg text-[#12141a] font-normal flex items-center justify-between border-b border-[#e2d7ba] pb-3">
              <span>Cloudinary CDN Status</span>
              <Layers className="w-4 h-4 text-[#12141a]" />
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#fcf5df] border border-[#e2d7ba]">
                <span className="text-stone-600 font-medium">Total Visual Assets</span>
                <span className="font-mono text-[#12141a] font-bold">
                  {galleryItems?.length ?? 0} Assets
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#fcf5df] border border-[#e2d7ba]">
                <span className="text-stone-600 font-medium">Delivery Format</span>
                <span className="font-mono text-emerald-800 font-bold">f_auto, q_auto (AVIF/WebP)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#fcf5df] border border-[#e2d7ba]">
                <span className="text-stone-600 font-medium">Edge Cache Status</span>
                <span className="font-mono text-emerald-800 font-bold">Global Edge Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Archive Grid */}
      <div className="bg-white border border-[#e2d7ba] rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e2d7ba] pb-4">
          <div>
            <h3 className="font-serif text-2xl text-[#12141a] font-normal">Visual Archive Library</h3>
            <p className="text-xs text-stone-500 font-light mt-0.5">
              Live photography synchronized across the public gallery and marketing surfaces.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['ALL', 'CULINARY', 'AMBIANCE', 'CELLAR', 'KITCHEN'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#12141a] text-[#fcf5df] font-bold'
                    : 'bg-[#fcf5df] text-[#12141a] hover:bg-[#f3e6c6] border border-[#dcd2b7]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        {isGalleryLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems?.map((item: GalleryItem) => (
              <div
                key={item.id}
                className="group relative rounded-xl overflow-hidden bg-[#fcf5df] border border-[#e2d7ba] shadow-sm hover:border-[#12141a] transition-all"
              >
                <div className="aspect-[4/3] overflow-hidden bg-stone-200">
                  <img
                    src={item.image || item.imageUrl || ''}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-[#12141a] text-[#fcf5df] font-bold">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono">Active Archive</span>
                  </div>
                  <h4 className="font-serif text-sm text-[#12141a] font-medium truncate pt-1">
                    {item.title}
                  </h4>
                  {item.caption && (
                    <p className="text-xs text-stone-600 line-clamp-2 font-light">{item.caption}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
