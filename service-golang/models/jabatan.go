package models

import (
	"github.com/jinzhu/gorm"
	uuid "github.com/satori/go.uuid"
)

//jabatan models
type Jabatan struct {
	BaseModel
	SatuanKerjaID   string `gorm:"size:40;index" json:"satuan_kerja_id"`
	NameSatuanKerja string `gorm:"size:64" json:"name_satuan_kerja"`
	NameJabatan     string `gorm:"size:64;index" json:"name_jabatan, omitempty"`
	Description     string `gorm:"type:text" json:"description"`
	CreatedBy       string `json:"created_by"`
	UpdatedBy       string `json:"updated_by"`
}

// BeforeCreate will set a UUID rather than numeric ID.
func (base *Jabatan) BeforeCreate(scope *gorm.Scope) error {
	uuid := uuid.NewV4()
	return scope.SetColumn("ID", uuid)
}
