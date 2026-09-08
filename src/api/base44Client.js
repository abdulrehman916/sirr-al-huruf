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
  async loginWithProvider(provider = 'google') {
    return unwrap(await client().auth.signInWithOAuth({ provider, options: { redirectTo: `${window.location.origin}/auth/callback` } }));
  },
  async login({ email, password }) {
    return unwrap(await client().auth.signInWithPassword({ email, password }));
  },
  async register({ email, password, ...metadata }) {
    return unwrap(await client().auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/login`,
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
  entities: new Proxy({}, { get: (_target, entity) => entityApi(String(entity)) }),
  isConfigured: configured,
};

export const base44 = platform;
