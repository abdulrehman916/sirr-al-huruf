/**
 * Independent Sirr al-Huruf platform client.
 * The `base44` export is a temporary compatibility alias only; no Base44
 * service, SDK, app ID, URL, auth session, or database is used here.
 */
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const configured = Boolean(url && anonKey);

export const supabase = configured
  ? createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null;

const client = () => {
  if (!supabase) throw new Error('Independent backend is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  return supabase;
};
const unwrap = ({ data, error }) => { if (error) throw error; return data; };
const toRecord = (row) => row ? ({ ...(row.data || {}), id: row.id, created_date: row.created_at, updated_date: row.updated_at }) : null;
const sortQuery = (query, sort) => {
  if (!sort) return query;
  const ascending = !String(sort).startsWith('-');
  const field = String(sort).replace(/^-/, '');
  const column = field === 'created_date' ? 'created_at' : field === 'updated_date' ? 'updated_at' : `data->>${field}`;
  return query.order(column, { ascending });
};

const entityApi = (entity) => ({
  async list(sort = null, limit = 100, skip = 0) {
    let query = client().from('platform_records').select('*').eq('entity', entity);
    query = sortQuery(query, sort).range(skip || 0, (skip || 0) + (limit || 100) - 1);
    return unwrap(await query).map(toRecord);
  },
  async filter(filters = {}, sort = null, limit = 100, skip = 0) {
    let query = client().from('platform_records').select('*').eq('entity', entity);
    Object.entries(filters || {}).forEach(([key, value]) => {
      query = key === 'id' ? query.eq('id', value) : query.eq(`data->>${key}`, String(value));
    });
    query = sortQuery(query, sort).range(skip || 0, (skip || 0) + (limit || 100) - 1);
    return unwrap(await query).map(toRecord);
  },
  async get(id) {
    return toRecord(unwrap(await client().from('platform_records').select('*').eq('entity', entity).eq('id', id).maybeSingle()));
  },
  async create(data) {
    return toRecord(unwrap(await client().from('platform_records').insert({ entity, data }).select().single()));
  },
  async update(id, data) {
    const current = unwrap(await client().from('platform_records').select('data').eq('entity', entity).eq('id', id).single());
    const row = unwrap(await client().from('platform_records').update({ data: { ...(current?.data || {}), ...data } })
      .eq('entity', entity).eq('id', id).select().single());
    return toRecord(row);
  },
  async delete(id) {
    unwrap(await client().from('platform_records').delete().eq('entity', entity).eq('id', id));
    return { success: true };
  },
  async bulkCreate(rows = []) {
    if (!rows.length) return [];
    return unwrap(await client().from('platform_records').insert(rows.map((data) => ({ entity, data }))).select()).map(toRecord);
  },
  async bulkUpdate(rows = []) {
    return Promise.all(rows.map((row) => { const { id, ...data } = row; return entityApi(entity).update(id, data); }));
  },
  async deleteMany(filters = {}) {
    let query = client().from('platform_records').delete().eq('entity', entity);
    Object.entries(filters || {}).forEach(([key, value]) => {
      query = key === 'id' ? query.eq('id', value) : query.eq(`data->>${key}`, String(value));
    });
    unwrap(await query);
    return { success: true };
  },
  subscribe(callback) {
    const channel = client().channel(`records:${entity}:${crypto.randomUUID()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'platform_records', filter: `entity=eq.${entity}` },
        (payload) => callback({ ...payload, data: toRecord(payload.new) }))
      .subscribe();
    return () => client().removeChannel(channel);
  },
});

const ACCESS_TO_DB = {
  PUBLIC: 'FREE',
  LOGIN: 'LOGIN',
  PREMIUM: 'PAID',
  PAID: 'PAID',
  SELECTED_CUSTOMERS: 'SELECTED',
};
const ACCESS_FROM_DB = {
  FREE: 'PUBLIC',
  LOGIN: 'LOGIN',
  PAID: 'PAID',
  COUPON: 'PREMIUM',
  SELECTED: 'SELECTED_CUSTOMERS',
};

const toManagedPage = (row) => row ? ({
  id: row.id,
  slug: row.slug,
  title_ml: row.title?.ml || '',
  title_en: row.title?.en || '',
  title_ar: row.title?.ar || '',
  excerpt_ml: row.summary?.ml || '',
  excerpt_en: row.summary?.en || '',
  excerpt_ar: row.summary?.ar || '',
  body_ml: row.body?.ml || '',
  body_en: row.body?.en || '',
  body_ar: row.body?.ar || '',
  status: row.status,
  access_mode: ACCESS_FROM_DB[row.access_mode] || 'PUBLIC',
  price_amount: Number(row.price_minor || 0) / 100,
  price_currency: row.currency || 'AED',
  validity_days: row.validity_days,
  lifetime_access: row.lifetime_access,
  featured_image_url: row.cover_url || '',
  attachment_url: row.asset_path || '',
  category: row.metadata?.category || 'general',
  is_featured: Boolean(row.metadata?.is_featured),
  seo_title: row.metadata?.seo_title || '',
  seo_description: row.metadata?.seo_description || '',
  version: Number(row.metadata?.version || 1),
  published_at: row.metadata?.published_at || null,
  last_published_by: row.metadata?.last_published_by || null,
  allow_download: row.metadata?.allow_download !== false,
  created_date: row.created_at,
  updated_date: row.updated_at,
}) : null;

const fromManagedPage = (page) => ({
  slug: page.slug,
  resource_type: 'PAGE',
  title: { ml: page.title_ml || '', en: page.title_en || '', ar: page.title_ar || '' },
  summary: { ml: page.excerpt_ml || '', en: page.excerpt_en || '', ar: page.excerpt_ar || '' },
  body: { ml: page.body_ml || '', en: page.body_en || '', ar: page.body_ar || '' },
  status: page.status || 'DRAFT',
  access_mode: ACCESS_TO_DB[page.access_mode] || 'FREE',
  price_minor: Math.max(0, Math.round(Number(page.price_amount || 0) * 100)),
  currency: page.price_currency || 'AED',
  validity_days: page.validity_days || null,
  lifetime_access: Boolean(page.lifetime_access),
  asset_path: page.attachment_url || null,
  cover_url: page.featured_image_url || null,
  metadata: {
    category: page.category || 'general',
    is_featured: Boolean(page.is_featured),
    seo_title: page.seo_title || '',
    seo_description: page.seo_description || '',
    version: Number(page.version || 1),
    published_at: page.published_at || null,
    last_published_by: page.last_published_by || null,
    allow_download: page.allow_download !== false,
  },
});

const isMissingResourcesSchema = (error) => (
  error?.code === '42P01'
  || error?.code === 'PGRST205'
  || /(resources|resource_assets|entitlements).*(not found|does not exist|schema cache)/i.test(error?.message || '')
);

const managedPageApi = {
  async list(sort = '-updated_date', limit = 100, skip = 0) {
    try {
      const ascending = !String(sort || '').startsWith('-');
      const field = String(sort || 'updated_date').replace(/^-/, '');
      const column = field === 'created_date' ? 'created_at' : field === 'published_at' ? 'updated_at' : 'updated_at';
      const rows = unwrap(await client().from('resources').select('*').eq('resource_type', 'PAGE')
        .order(column, { ascending }).range(skip || 0, (skip || 0) + (limit || 100) - 1));
      return rows.map(toManagedPage);
    } catch (error) {
      if (isMissingResourcesSchema(error)) return entityApi('ManagedPage').list(sort, limit, skip);
      throw error;
    }
  },
  async filter(filters = {}, sort = '-updated_date', limit = 100, skip = 0) {
    try {
      let query = client().from('resources').select('*').eq('resource_type', 'PAGE');
      if (filters.slug) query = query.eq('slug', filters.slug);
      if (filters.status) query = query.eq('status', filters.status);
      if (filters.access_mode) query = query.eq('access_mode', ACCESS_TO_DB[filters.access_mode] || filters.access_mode);
      const ascending = !String(sort || '').startsWith('-');
      const field = String(sort || 'updated_date').replace(/^-/, '');
      const column = field === 'created_date' ? 'created_at' : field === 'published_at' ? 'updated_at' : 'updated_at';
      const rows = unwrap(await query.order(column, { ascending }).range(skip || 0, (skip || 0) + (limit || 100) - 1));
      return rows.map(toManagedPage);
    } catch (error) {
      if (isMissingResourcesSchema(error)) return entityApi('ManagedPage').filter(filters, sort, limit, skip);
      throw error;
    }
  },
  async get(id) {
    try {
      return toManagedPage(unwrap(await client().from('resources').select('*').eq('id', id).maybeSingle()));
    } catch (error) {
      if (isMissingResourcesSchema(error)) return entityApi('ManagedPage').get(id);
      throw error;
    }
  },
  async create(data) {
    try {
      return toManagedPage(unwrap(await client().from('resources').insert(fromManagedPage(data)).select().single()));
    } catch (error) {
      if (isMissingResourcesSchema(error)) return entityApi('ManagedPage').create(data);
      throw error;
    }
  },
  async update(id, data) {
    try {
      const current = await this.get(id);
      if (current && !('title' in current)) {
        return toManagedPage(unwrap(await client().from('resources').update(fromManagedPage({ ...current, ...data }))
          .eq('id', id).select().single()));
      }
      return entityApi('ManagedPage').update(id, data);
    } catch (error) {
      if (isMissingResourcesSchema(error)) return entityApi('ManagedPage').update(id, data);
      throw error;
    }
  },
  async delete(id) {
    try {
      unwrap(await client().from('resources').delete().eq('id', id));
      return { success: true };
    } catch (error) {
      if (isMissingResourcesSchema(error)) return entityApi('ManagedPage').delete(id);
      throw error;
    }
  },
};

const auth = {
  async me() {
    if (!configured) return null;
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;
    const meta = data.user.user_metadata || {};
    return { id: data.user.id, email: data.user.email, full_name: meta.full_name || meta.name || '',
      photo_url: meta.avatar_url || meta.picture || '', role: meta.role || 'user', ...meta };
  },
  async isAuthenticated() { return Boolean(await this.me()); },
  async loginWithProvider(provider = 'google', returnTo = '/') {
    const safeReturn = String(returnTo || '/').startsWith('/') && !String(returnTo).startsWith('//') ? returnTo : '/';
    const redirectTo = `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(safeReturn)}`;
    return unwrap(await client().auth.signInWithOAuth({ provider, options: { redirectTo } }));
  },
  async login({ email, password }) {
    return unwrap(await client().auth.signInWithPassword({ email, password }));
  },
  async requestLoginOtp({ email, redirectTo } = {}) {
    if (!email) throw new Error('Email is required.');
    return unwrap(await client().auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: redirectTo || `${window.location.origin}/auth/callback`,
      },
    }));
  },
  async verifyLoginOtp({ email, token } = {}) {
    if (!email || !token) throw new Error('Email and verification code are required.');
    return unwrap(await client().auth.verifyOtp({ email, token, type: 'email' }));
  },
  async register({ email, password, emailRedirectTo, ...metadata }) {
    return unwrap(await client().auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: emailRedirectTo || `${window.location.origin}/login`,
      },
    }));
  },
  async verifyOtp({ email, token, otpCode, type = 'signup' }) {
    return unwrap(await client().auth.verifyOtp({ email, token: token || otpCode, type }));
  },
  async resendOtp(input, type = 'signup') {
    const email = typeof input === 'string' ? input : input?.email;
    return unwrap(await client().auth.resend({ email, type: input?.type || type }));
  },
  async resetPasswordRequest(email) {
    return unwrap(await client().auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` }));
  },
  async resetPassword({ password, newPassword }) {
    return unwrap(await client().auth.updateUser({ password: password || newPassword }));
  },
  async updateMe(attributes) { return unwrap(await client().auth.updateUser({ data: attributes })).user; },
  async setToken(accessToken, refreshToken = '') {
    return unwrap(await client().auth.setSession({ access_token: accessToken, refresh_token: refreshToken }));
  },
  async logout() { return unwrap(await client().auth.signOut()); },
};

const integrations = { Core: {
  async UploadFile({ file, bucket = 'private-documents', path } = {}) {
    const user = await auth.me();
    if (!user) throw new Error('Sign in is required to upload files.');
    const safeName = String(file?.name || 'upload').replace(/[^a-zA-Z0-9._-]/g, '-');
    const objectPath = path || `${user.id}/${crypto.randomUUID()}-${safeName}`;
    unwrap(await client().storage.from(bucket).upload(objectPath, file, { upsert: false }));
    return { file_url: objectPath, bucket };
  },
  async CreateSignedDownload({ path, bucket = 'private-documents', expiresIn = 120 } = {}) {
    if (!path) throw new Error('A file path is required.');
    const data = unwrap(await client().storage.from(bucket).createSignedUrl(path, expiresIn, { download: true }));
    return { signed_url: data.signedUrl, expires_in: expiresIn };
  },
  async InvokeLLM(payload) { return unwrap(await client().functions.invoke('invoke-llm', { body: payload })); },
} };

export const platform = {
  auth,
  integrations,
  functions: { async invoke(name, body = {}) {
    const { data, error } = await client().functions.invoke(name, { body });
    if (error) throw error;
    return { data };
  } },
  entities: new Proxy({}, { get: (_target, entity) => String(entity) === 'ManagedPage' ? managedPageApi : entityApi(String(entity)) }),
  async canAccessResource(resourceId) {
    if (!resourceId) return false;
    return Boolean(unwrap(await client().rpc('can_access_resource', { target: resourceId })));
  },
  async listResourceAssets(resourceId) {
    if (!resourceId) return [];
    return unwrap(await client().from('resource_assets').select('*')
      .eq('resource_id', resourceId).order('sort_order', { ascending: true }));
  },
  async uploadResourceAsset(resourceId, file, options = {}) {
    const user = await auth.me();
    if (!user) throw new Error('Owner sign-in is required to upload files.');
    if (!resourceId || !file) throw new Error('A saved resource and file are required.');
    const bucket = options.bucket || 'private-documents';
    const safeName = String(file.name || 'upload').replace(/[^a-zA-Z0-9._-]/g, '-');
    const objectPath = `${user.id}/resources/${resourceId}/${crypto.randomUUID()}-${safeName}`;
    unwrap(await client().storage.from(bucket).upload(objectPath, file, { upsert: false, contentType: file.type || undefined }));
    try {
      return unwrap(await client().from('resource_assets').insert({
        resource_id: resourceId,
        asset_type: options.assetType || (file.type === 'application/pdf' ? 'PDF' : 'IMAGE'),
        bucket,
        object_path: objectPath,
        title: options.title || {},
        mime_type: file.type || null,
        byte_size: Number(file.size || 0),
        is_preview: Boolean(options.isPreview),
        is_downloadable: options.isDownloadable !== false,
        sort_order: Number(options.sortOrder || 0),
      }).select().single());
    } catch (error) {
      await client().storage.from(bucket).remove([objectPath]);
      throw error;
    }
  },
  async deleteResourceAsset(asset) {
    if (!asset?.id) return { success: true };
    if (asset.bucket && asset.object_path) {
      unwrap(await client().storage.from(asset.bucket).remove([asset.object_path]));
    }
    unwrap(await client().from('resource_assets').delete().eq('id', asset.id));
    return { success: true };
  },
  async createResourceAssetDownload(asset, expiresIn = 120) {
    if (asset?.external_url) return asset.external_url;
    if (!asset?.bucket || !asset?.object_path) throw new Error('Download file is not configured.');
    const data = unwrap(await client().storage.from(asset.bucket).createSignedUrl(asset.object_path, expiresIn, { download: true }));
    return data.signedUrl;
  },
  async listMyEntitlements() {
    const user = await auth.me();
    if (!user) return [];
    try {
      return unwrap(await client().from('entitlements')
        .select('id, starts_at, expires_at, revoked_at, source, resource:resources(*)')
        .eq('user_id', user.id).is('revoked_at', null).order('created_at', { ascending: false }));
    } catch (error) {
      if (isMissingResourcesSchema(error)) return [];
      throw error;
    }
  },
  async listFreeResources(limit = 100) {
    try {
      return unwrap(await client().from('resources').select('*')
        .eq('status', 'PUBLISHED').eq('access_mode', 'FREE')
        .order('sort_order', { ascending: true }).limit(limit));
    } catch (error) {
      if (!isMissingResourcesSchema(error)) throw error;
      const pages = await entityApi('ManagedPage').filter({ status: 'PUBLISHED', access_mode: 'PUBLIC' }, '-updated_date', limit);
      return pages.map((page) => ({
        id: page.id,
        slug: page.slug,
        resource_type: 'PAGE',
        title: { ml: page.title_ml || '', en: page.title_en || '', ar: page.title_ar || '' },
        summary: { ml: page.excerpt_ml || '', en: page.excerpt_en || '', ar: page.excerpt_ar || '' },
        access_mode: 'FREE',
        status: 'PUBLISHED',
      }));
    }
  },
  isConfigured: configured,
};

export const base44 = platform;
