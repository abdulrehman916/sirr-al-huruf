import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Plus, 
  Search, 
  Shield, 
  ShieldOff, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar,
  LogIn,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const STATUS_COLORS = {
  ACTIVE: "bg-green-500/20 text-green-400 border-green-500/40",
  BLOCKED: "bg-red-500/20 text-red-400 border-red-500/40",
  REMOVED: "bg-gray-500/20 text-gray-400 border-gray-500/40"
};

export default function ApprovedUsersTab() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { toast } = useToast();

  // Form states
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newName, setNewName] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [revokeReason, setRevokeReason] = useState("");
  const [newStatus, setNewStatus] = useState("BLOCKED");

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, statusFilter]);

  const loadUsers = async () => {
    try {
      const result = await base44.entities.ApprovedUser.list();
      setUsers(result || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load approved users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(u => 
        u.email.toLowerCase().includes(query) ||
        (u.full_name && u.full_name.toLowerCase().includes(query)) ||
        (u.phone && u.phone.toLowerCase().includes(query))
      );
    }

    if (statusFilter !== "ALL") {
      filtered = filtered.filter(u => u.status === statusFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    
    if (!newEmail.trim()) {
      toast({
        title: "Error",
        description: "Email is required",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await base44.functions.invoke("approveUser", {
        email: newEmail,
        phone: newPhone,
        full_name: newName,
        notes: newNotes
      });

      if (result.data?.success) {
        toast({
          title: "Success",
          description: "User approved successfully"
        });
        setShowAddModal(false);
        setNewEmail("");
        setNewPhone("");
        setNewName("");
        setNewNotes("");
        loadUsers();
      } else {
        toast({
          title: "Error",
          description: result.data?.error || "Failed to approve user",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve user",
        variant: "destructive"
      });
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedUser) return;

    try {
      const result = await base44.functions.invoke("updateUserStatus", {
        user_id: selectedUser.id,
        status: newStatus,
        revoke_reason: (newStatus === 'BLOCKED' || newStatus === 'REMOVED') ? revokeReason : ''
      });

      if (result.data?.success) {
        toast({
          title: "Success",
          description: `User status updated to ${newStatus}`
        });
        setShowRevokeModal(false);
        setSelectedUser(null);
        setRevokeReason("");
        loadUsers();
      } else {
        toast({
          title: "Error",
          description: result.data?.error || "Failed to update status",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const openRevokeModal = (user, status) => {
    setSelectedUser(user);
    setNewStatus(status);
    setRevokeReason("");
    setShowRevokeModal(true);
  };

  const getStatusBadge = (status) => {
    const config = {
      ACTIVE: { label: "Active", icon: Shield },
      BLOCKED: { label: "Blocked", icon: ShieldOff },
      REMOVED: { label: "Removed", icon: Trash2 }
    };
    const { label, icon: Icon } = config[status] || config.ACTIVE;
    
    return (
      <Badge className={`${STATUS_COLORS[status]} border`}>
        <Icon className="w-3 h-3 mr-1" />
        {label}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Approved Users</h3>
          <p className="text-sm text-muted-foreground">
            Manage direct access users (no OTP required)
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by email, name, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 rounded-md border border-input bg-transparent text-sm"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="BLOCKED">Blocked</option>
              <option value="REMOVED">Removed</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {users.filter(u => u.status === 'ACTIVE').length}
              </div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {users.filter(u => u.status === 'BLOCKED').length}
              </div>
              <div className="text-xs text-muted-foreground">Blocked</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400">
                {users.filter(u => u.status === 'REMOVED').length}
              </div>
              <div className="text-xs text-muted-foreground">Removed</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {filteredUsers.length} User{filteredUsers.length !== 1 ? 's' : ''}
          </CardTitle>
          <CardDescription>
            {loading ? "Loading..." : "Click on a user to manage access"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-muted-foreground py-8">
              Loading users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p>No users found</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="font-medium text-sm">{user.email}</span>
                        {getStatusBadge(user.status)}
                      </div>
                      {user.full_name && (
                        <div className="text-xs text-muted-foreground ml-5">
                          {user.full_name}
                        </div>
                      )}
                      {user.phone && (
                        <div className="text-xs text-muted-foreground ml-5 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {user.phone}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground ml-5 flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1">
                          <LogIn className="w-3 h-3" />
                          {user.login_count || 0} logins
                        </span>
                        {user.last_login && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Last: {new Date(user.last_login).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {user.status === 'ACTIVE' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openRevokeModal(user, 'BLOCKED')}
                            className="text-xs h-8"
                          >
                            <ShieldOff className="w-3 h-3 mr-1" />
                            Block
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openRevokeModal(user, 'REMOVED')}
                            className="text-xs h-8 text-red-400"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Remove
                          </Button>
                        </>
                      )}
                      {(user.status === 'BLOCKED' || user.status === 'REMOVED') && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openRevokeModal(user, 'ACTIVE')}
                          className="text-xs h-8 text-green-400"
                        >
                          <Shield className="w-3 h-3 mr-1" />
                          Reactivate
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add Approved User</CardTitle>
              <CardDescription>
                Grant direct access (no OTP required)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="user@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+971 50 123 4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <textarea
                    id="notes"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Optional admin notes"
                    className="w-full min-h-[80px] p-2 rounded-md border border-input bg-transparent text-sm"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    <Plus className="w-4 h-4 mr-2" />
                    Approve User
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Revoke/Reactivate Modal */}
      {showRevokeModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {newStatus === 'ACTIVE' ? 'Reactivate User' : `${newStatus} User`}
              </CardTitle>
              <CardDescription>
                {selectedUser.email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(newStatus === 'BLOCKED' || newStatus === 'REMOVED') && (
                <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <p className="text-xs text-amber-400 flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5" />
                    This will immediately revoke access
                  </p>
                </div>
              )}
              {(newStatus === 'BLOCKED' || newStatus === 'REMOVED') && (
                <div className="space-y-2 mb-4">
                  <Label htmlFor="reason">Reason (Optional)</Label>
                  <textarea
                    id="reason"
                    value={revokeReason}
                    onChange={(e) => setRevokeReason(e.target.value)}
                    placeholder="Reason for revoking access"
                    className="w-full min-h-[80px] p-2 rounded-md border border-input bg-transparent text-sm"
                  />
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowRevokeModal(false);
                    setSelectedUser(null);
                    setRevokeReason("");
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateStatus}
                  className={`flex-1 ${
                    newStatus === 'ACTIVE' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : newStatus === 'BLOCKED'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  Confirm
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}