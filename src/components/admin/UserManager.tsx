
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  joinDate: string;
  lastActive: string;
  gamesPlayed: number;
  totalScore: number;
  level: number;
  achievements: string[];
}

export const UserManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      role: 'student',
      joinDate: '2024-01-15',
      lastActive: '2024-01-20',
      gamesPlayed: 45,
      totalScore: 2340,
      level: 8,
      achievements: ['🏆 First Win', '🔥 Streak Master', '🧠 Math Genius']
    },
    {
      id: '2',
      name: 'Sarah Teacher',
      email: 'sarah@school.com',
      role: 'teacher',
      joinDate: '2024-01-10',
      lastActive: '2024-01-20',
      gamesPlayed: 23,
      totalScore: 1890,
      level: 12,
      achievements: ['👑 Educator', '📚 Knowledge Keeper']
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500';
      case 'teacher': return 'bg-blue-500';
      case 'student': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getLevelEmoji = (level: number) => {
    if (level >= 20) return '🏆';
    if (level >= 15) return '💎';
    if (level >= 10) return '⭐';
    if (level >= 5) return '🌟';
    return '🎯';
  };

  return (
    <div className="space-y-6">
      {/* User Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border-white/20">
          <CardContent className="p-6 text-center">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-2xl font-bold text-white">{users.length}</div>
            <div className="text-white/80 text-sm">Total Users</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border-white/20">
          <CardContent className="p-6 text-center">
            <div className="text-3xl mb-2">🎓</div>
            <div className="text-2xl font-bold text-white">{users.filter(u => u.role === 'student').length}</div>
            <div className="text-white/80 text-sm">Students</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border-white/20">
          <CardContent className="p-6 text-center">
            <div className="text-3xl mb-2">👨‍🏫</div>
            <div className="text-2xl font-bold text-white">{users.filter(u => u.role === 'teacher').length}</div>
            <div className="text-white/80 text-sm">Teachers</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border-white/20">
          <CardContent className="p-6 text-center">
            <div className="text-3xl mb-2">⚡</div>
            <div className="text-2xl font-bold text-white">{users.filter(u => new Date(u.lastActive) > new Date(Date.now() - 24*60*60*1000)).length}</div>
            <div className="text-white/80 text-sm">Active Today</div>
          </CardContent>
        </Card>
      </div>

      {/* User Management */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex justify-between items-center">
            👥 User Management
            <Button className="bg-green-500 hover:bg-green-600 text-white">
              ➕ Add User
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4">
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
            />
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40 bg-white/20 border-white/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* User List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredUsers.map((user) => (
              <div key={user.id} className="bg-white/20 p-4 rounded-lg border border-white/30">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-semibold">{user.name}</h3>
                        <Badge className={`${getRoleColor(user.role)} text-white text-xs`}>
                          {user.role}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <span className="text-lg">{getLevelEmoji(user.level)}</span>
                          <span className="text-white text-sm">Level {user.level}</span>
                        </div>
                      </div>
                      <p className="text-white/70 text-sm">{user.email}</p>
                      <div className="flex gap-4 text-xs text-white/60 mt-1">
                        <span>Joined: {user.joinDate}</span>
                        <span>Last Active: {user.lastActive}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex gap-2 mb-2">
                      <Button size="sm" variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                        ✏️ Edit
                      </Button>
                      <Button size="sm" variant="destructive" className="bg-red-500 hover:bg-red-600">
                        🗑️
                      </Button>
                    </div>
                    <div className="text-white text-sm">
                      <div>🎮 {user.gamesPlayed} games</div>
                      <div>⭐ {user.totalScore} points</div>
                    </div>
                  </div>
                </div>
                
                {/* Achievements */}
                <div className="mt-3 pt-3 border-t border-white/20">
                  <div className="text-white/80 text-xs mb-1">🏆 Achievements:</div>
                  <div className="flex gap-1 flex-wrap">
                    {user.achievements.map((achievement, index) => (
                      <Badge key={index} variant="outline" className="bg-white/10 text-white border-white/30 text-xs">
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
