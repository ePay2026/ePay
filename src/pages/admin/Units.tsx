import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";

export default function AdminUnits() {
  const [units, setUnits] = useState<{ id: string; name: string }[]>([]);
  const [newUnitName, setNewUnitName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      const response = await fetch('/api/units');
      if (response.ok) {
        const data = await response.json();
        setUnits(data);
      }
    } catch (error) {
      console.error('Failed to fetch units:', error);
    }
  };

  const handleAddUnit = async () => {
    if (!newUnitName.trim()) return;
    setIsAdding(true);
    try {
      const response = await fetch('/api/units', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newUnitName })
      });
      if (response.ok) {
        toast.success("Unit berhasil ditambahkan");
        setNewUnitName("");
        fetchUnits();
      } else {
        toast.error("Gagal menambahkan unit");
      }
    } catch (error) {
      toast.error("Gagal menambahkan unit");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteUnit = async (id: string) => {
    try {
      const response = await fetch(`/api/units/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        toast.success("Unit berhasil dihapus");
        fetchUnits();
      } else {
        toast.error("Gagal menghapus unit");
      }
    } catch (error) {
      toast.error("Gagal menghapus unit");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unit Layanan</CardTitle>
        <CardDescription>Kelola Daftar Unit Layanan.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input 
            value={newUnitName} 
            onChange={(e) => setNewUnitName(e.target.value)} 
            placeholder="Nama Unit Baru" 
          />
          <Button onClick={handleAddUnit} disabled={isAdding}>
            <Plus className="mr-2 h-4 w-4" /> Tambah
          </Button>
        </div>
        <div className="border rounded-lg divide-y">
            {units.map(unit => (
                <div key={unit.id} className="p-3 flex justify-between items-center">
                    <span>{unit.name}</span>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteUnit(unit.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                </div>
            ))}
            {units.length === 0 && <div className="p-3 text-sm text-slate-500">Belum ada unit</div>}
        </div>
      </CardContent>
    </Card>
  );
}
