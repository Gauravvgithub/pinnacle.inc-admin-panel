import { useDispatch } from 'react-redux';
import React, { useState } from 'react';
import { createSeo, type Seo } from '../../store/seoSlice';
import { AppDispatch } from '../../store';
import { useNavigate } from 'react-router-dom';


const AddSeo: React.FC = () => {
      const dispatch = useDispatch<AppDispatch>();
      const navigate = useNavigate()
  const initialSeoData: Seo = {
        _id: '',
        page_title: '',
        metaTitle: '',
        metaDes: '',
        metaKeywords: '',
        cannicalUrl: '',
        ogTitle: '',
        ogDes: '',
        OgImageUrl: '',
        OgType: '',
        OgImageType: '',
        OgImageWidth: '',
        OgImageHeight: '',
        hreflang: '',
        mobileFriendly: '',
        xmlSitemap: '',
        ampUrl: '',
        copyright: false,
        contentAuthor: 0,
        googleSiteVerification: false,
        schemaMaprkup: '',
        cspHeader: '',
        enableHTTP3: false,
        enableBrotli: false,
        securityTxt: '',
        robotsMeta: {
            index: false,
            follow: false,
        },
        createdBy: {
        _id: '',
        fullName: '',
    }
  };
  const [showPageInput, setShowPageInput] = useState(false);

  const [seoData, setSeoData] = useState<Seo>(initialSeoData);
  const [tags, setTags] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreviews, setImagePreviews] = useState({
    ogImage: '',
    twitterImage: ''
  });
  const [sectionVisibility, setSectionVisibility] = useState({
    basic: true,
    openGraph: true,
    twitter: true,
    technical: false,
    advanced: false
  });

  // Validation functions
  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateImageUrl = (url: string): boolean => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  const validateJson = (jsonString: string): boolean => {
    try {
      JSON.parse(jsonString);
      return true;
    } catch {
      return false;
    }
  };

  // Handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSeoData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };



  type SectionKey = keyof typeof sectionVisibility;
  const toggleSection = (section: SectionKey) => {
    setSectionVisibility(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const resetForm = () => {
    setSeoData(initialSeoData);
    setTags([]);
    setErrors({});
    setImagePreviews({ ogImage: '', twitterImage: '' });
  };
  const handlePageSave = () => {
    if(!seoData.page_title.trim()) {
      setErrors(prev => ({...prev, page: 'Page name is required'}));
      return;
    }
    setShowPageInput(false);
    setErrors(prev => ({...prev, page: ''}));
  };

async function sendToServer(data:any){
  console.log(data,"88888888888")
 try{
 await dispatch(createSeo(data)).unwrap();
 navigate('/apps/Manage-seo')

  setSeoData(initialSeoData);

 }catch(error:any){
  console.log(error)
 }finally{
 }

}

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("hello");
    console.log(seoData);
    
    const newErrors: Record<string, string> = {};

    if (!seoData.page_title.trim()) {
      newErrors.page = 'Page name is required';
    }
  

    if (!seoData.metaTitle) newErrors.title = 'Title is required';
    if (seoData.metaTitle.length > 100) newErrors.title = 'Max 100 characters';
    if (!seoData.metaDes) newErrors.description = 'Description is required';
    if (seoData.metaDes.length > 200) newErrors.description = 'Max 200 characters';
    if(seoData.cannicalUrl.length!==0){

 
    if (!validateUrl(seoData.cannicalUrl)) newErrors.canonicalUrl = 'Invalid URL';
    }
    if(seoData.OgImageUrl.length!==0){
    if (!validateImageUrl(seoData.OgImageUrl)) newErrors.OgImageUrl = 'Valid image required';
    }
    // if (tags.length === 0) newErrors.tags = 'At least one tag required';
    if (seoData.schemaMaprkup && !validateJson(seoData.schemaMaprkup)) {
      newErrors.schemaMaprkup = 'Invalid JSON';
    }
    console.log(newErrors)
    setErrors(newErrors);

     console.log("object")
      sendToServer({ ...seoData, metaKeywords: tags  });
  };

  // Character counters
  const charCounters = {
    title: seoData.metaTitle.length,
    description: seoData.metaDes.length,
    ogTitle: seoData.ogTitle.length,
    ogDescription: seoData.ogDes.length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div  className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Add Meta Data</h1>

{/* Add Page Section */}
{showPageInput ? (
  <div className="flex flex-col items-center gap-2">
    <div className="flex gap-2">
      <input
        type="text"
        name="page_title"
        value={seoData.page_title}
        onChange={handleChange}
        className={`border rounded-lg px-3 py-2 w-64 ${
          errors.page ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder="Enter page name"
        autoFocus
      />
      <button
        type="button"
        onClick={() => {
          setShowPageInput(false);
          setErrors(prev => ({...prev, page: ''}));
          // Reset only if creating new page
          if(!initialSeoData.page_title) {
            setSeoData(prev => ({...prev, page: ''}));
          }
        }}
        className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={handlePageSave}
        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Save
      </button>
     
    </div>
    {errors.page && showPageInput==true && (
      <p className="text-red-500 text-sm">{errors.page}</p>
    )}
  </div>
) : seoData.page_title ? (
  <div className="inline-flex items-center gap-2 mb-4">
    <span className="text-gray-600">Page: <strong> {seoData.page_title}</strong></span>
    <button
      type="button"
      onClick={() => setShowPageInput(true)}
      className="text-blue-600 hover:text-blue-800 text-sm"
    >
      Edit
    </button>
  </div>
) : (
  <button
    type="button"
    onClick={() => setShowPageInput(true)}
    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
  >
    Add Blog Slug
  </button>
)}

{errors.page && showPageInput==false && (
      <p className="text-red-500 text-sm mt-2">{errors.page}</p>
    )}
       

        {/* Basic SEO Section */}

        <SectionHeader 
          title="Basic SEO Settings" 
          isOpen={sectionVisibility.basic}
          onToggle={() => toggleSection('basic')}
        />
        {sectionVisibility.basic && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <FormField
              label="Meta Title"
              name="metaTitle"
              value={seoData.metaTitle}
              onChange={handleChange}
              error={errors.title}
              maxLength={60}
              charCount={charCounters.title}
            />
            <FormTextArea
              label="Meta Description"
              name="metaDes"
              value={seoData.metaDes}
              onChange={handleChange}
              error={errors.description}
              maxLength={200}
              charCount={charCounters.description}
            />
            <FormField
              label="Canonical URL"
              name="cannicalUrl"
              value={seoData.cannicalUrl}
              onChange={handleChange}
              error={errors.cannicalUrl}
              placeholder="https://example.com/page"
            />
            <FormField
              label="Meta Keywords"
              name="metaKeywords"
              value={seoData.metaKeywords}
              onChange={handleChange}
              error={errors.metaKeywords}
              placeholder=""
            />
          </div>
        )}

        {/* Open Graph Section */}
        <SectionHeader
          title="Open Graph Settings"
          isOpen={sectionVisibility.openGraph}
          onToggle={() => toggleSection('openGraph')}
        />
        {sectionVisibility.openGraph && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <FormField
              label="OG Title"
              name="ogTitle"
              value={seoData.ogTitle}
              onChange={handleChange}
              error={errors.ogTitle}
              maxLength={100}
              charCount={charCounters.ogTitle}
            />
            <FormTextArea
              label="OG Description"
              name="ogDes"
              value={seoData.ogDes}
              onChange={handleChange}
              error={errors.ogDes}
              maxLength={200}
              charCount={charCounters.ogDescription}
            />
            <ImageInputWithPreview
              label="OG Image URL"
              name="OgImageUrl"
              value={seoData.OgImageUrl}
              onChange={handleChange}
              error={errors.ogImageUrl}
              preview={imagePreviews.ogImage}
              onBlur={() => setImagePreviews(p => ({
                ...p,
                ogImage: validateImageUrl(seoData.OgImageUrl) ? seoData.OgImageUrl : ''
              }))}
            />
            <SelectField
              label="OG Type"
              name="OgType"
              value={seoData.OgType}
              options={[
                { value: 'website', label: 'Website' },
                { value: 'article', label: 'Article' },
                { value: 'product', label: 'Product' }
              ]}
              onChange={handleChange}
            />
            <FormField
              label="OG Image Type"
              name="OgImageType"
              value={seoData.OgImageType || "image/webp"}
              onChange={handleChange}
              error={errors.OgImageType}
              // maxLength={100}
              // charCount={charCounters.ogTitle}
            />
            <FormField
              label="OG Image width"
              name="OgImageWidth"
              value={seoData.OgImageWidth || "1920"}
              onChange={handleChange}
              error={errors.OgImageWidth}
              // maxLength={100}
              // charCount={charCounters.ogTitle}
            />
            <FormField
              label="OG Image height"
              name="OgImageHeight"
              value={seoData.OgImageHeight || "1920"}
              onChange={handleChange}
              error={errors.OgImageHeight}
              // maxLength={100}
              // charCount={charCounters.ogTitle}
            />
          </div>
        )}

        {/* Technical SEO Section */}
    
        {/* Advanced SEO Section */}
        <SectionHeader
          title="Advanced Settings"
          isOpen={sectionVisibility.advanced}
          onToggle={() => toggleSection('advanced')}
        />
        {sectionVisibility.advanced && (
          <div className="space-y-4 mb-6">
            <FormTextArea
              label="Schema Markup (JSON-LD)"
              name="schemaMaprkup"
              value={seoData.schemaMaprkup}
              onChange={handleChange}
              error={errors.schemaMarkup}
              rows={6}
              placeholder={`{
  "@context": "https://schema.org",
  "@type": "Article"
}`}
            />
            <FormField
              label="Google Site Verification"
              name="googleSiteVerification"
              value={seoData.googleSiteVerification ? String(seoData.googleSiteVerification) : ''}
              onChange={handleChange}
              info="Google Search Console verification code"
            />
            <FormTextArea
              label="Content Security Policy"
              name="cspHeader"
              value={seoData.cspHeader}
              onChange={handleChange}
              rows={2}
              placeholder="default-src 'self'; script-src 'unsafe-inline'"
            />
            <FormTextArea
              label="Security.txt Content"
              name="securityTxt"
              value={seoData.securityTxt}
              onChange={handleChange}
              rows={3}
              placeholder={`Contact: mailto:security@example.com\nEncryption: https://example.com/pgp-key.txt`}
            />
            <div className="grid grid-cols-2 gap-4">
              <CheckboxField
                label="Enable HTTP/3"
                checked={seoData.enableHTTP3}
                onChange={() => setSeoData(p => ({...p, enableHTTP3: !p.enableHTTP3}))}
              />
              <CheckboxField
                label="Enable Brotli Compression"
                checked={seoData.enableBrotli}
                onChange={() => setSeoData(p => ({...p, enableBrotli: !p.enableBrotli}))}
              />
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={resetForm}
            className="px-6 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
           Add
          </button>
        </div>
      </div>
    </div>
  );
};

// Reusable Components
interface SectionHeaderProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, isOpen, onToggle }) => (
  <div className="flex justify-between items-center bg-gray-100 p-3 rounded-t-lg cursor-pointer mt-6" onClick={onToggle}>
    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
      ▼
    </span>
  </div>
);

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  maxLength?: number;
  charCount?: number;
  placeholder?: string;
  info?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  maxLength,
  charCount,
  placeholder,
  info
}) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full border rounded-lg p-2 ${error ? 'border-red-500' : 'border-gray-300'}`}
      placeholder={placeholder}
    />
    <div className="flex justify-between text-sm">
      {error && <span className="text-red-500">{error}</span>}
      {maxLength && (
        <span className={`ml-auto ${charCount! > maxLength ? 'text-red-500' : 'text-gray-500'}`}>
          {charCount}/{maxLength}
        </span>
      )}
    </div>
    {info && <p className="text-gray-500 text-sm mt-1">{info}</p>}
  </div>
);

interface ImageInputWithPreviewProps extends FormFieldProps {
  preview: string;
  onBlur: () => void;
}

const ImageInputWithPreview: React.FC<ImageInputWithPreviewProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  preview,
  onBlur
}) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="flex gap-2">
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`flex-1 border rounded-lg p-2 ${error ? 'border-red-500' : 'border-gray-300'}`}
      />
      {preview && (
        <div className="w-16 h-16 border rounded-lg overflow-hidden">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectField: React.FC<SelectFieldProps> = ({ label, name, value, options, onChange }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-lg p-2"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

interface FormTextAreaProps extends Omit<FormFieldProps, 'onChange'> {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
}

const FormTextArea: React.FC<FormTextAreaProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  maxLength,
  charCount,
  rows = 3
}) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      className={`w-full border rounded-lg p-2 ${error ? 'border-red-500' : 'border-gray-300'}`}
    />
    <div className="flex justify-between text-sm">
      {error && <span className="text-red-500">{error}</span>}
      {maxLength && (
        <span className={`ml-auto ${charCount! > maxLength ? 'text-red-500' : 'text-gray-500'}`}>
          {charCount}/{maxLength}
        </span>
      )}
    </div>
  </div>
);

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

const CheckboxField: React.FC<CheckboxProps> = ({ label, checked, onChange }) => (
  <label className="flex items-center space-x-2">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="form-checkbox h-4 w-4 text-blue-600"
    />
    <span className="text-sm text-gray-700">{label}</span>
  </label>
);

export default AddSeo;