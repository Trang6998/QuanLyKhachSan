using System;
using System.Data.Entity;
using System.Linq;
using System.Web.Http;
using System.Threading.Tasks;
using HVITCore.Controllers;
using System.Data.Entity.Infrastructure;
using QuanLyKhachSanApp.Models;

namespace QuanLyKhachSanApp.Controllers
{
    [RoutePrefix("api/datphong")]
    public class DatPhongController : BaseApiController
    {
        [HttpGet, Route("")]
        public async Task<IHttpActionResult> Search([FromUri]Pagination pagination, [FromUri]int? nhanVienID = null, [FromUri]int? loaiPhongID = null)
        {
            using (var db = new dbQuanLyKhachSan())
            {
                IQueryable<DatPhong> results = db.DatPhong;
                if (pagination == null)
                    pagination = new Pagination();
                if (pagination.includeEntities)
                {
                    results = results.Include(o => o.LoaiPhong);
                }

                if (nhanVienID.HasValue) results = results.Where(o => o.NhanVienID == nhanVienID);
                if (loaiPhongID.HasValue) results = results.Where(o => o.LoaiPhongID == loaiPhongID);

                results = results.OrderBy(o => o.DatPhongID);

                return Ok((await GetPaginatedResponse(results, pagination)));
            }
        }

        [HttpGet, Route("{datPhongID:int}")]
        public async Task<IHttpActionResult> Get(int datPhongID)
        {
            using (var db = new dbQuanLyKhachSan())
            {
                var datPhong = await db.DatPhong
                    .Include(o => o.LoaiPhong)
                    .SingleOrDefaultAsync(o => o.DatPhongID == datPhongID);

                if (datPhong == null)
                    return NotFound();

                return Ok(datPhong);
            }
        }

        [HttpPost, Route("")]
        public async Task<IHttpActionResult> Insert([FromBody]DatPhong datPhong)
        {
            if (datPhong.DatPhongID != 0) return BadRequest("Invalid DatPhongID");

            using (var db = new dbQuanLyKhachSan())
            {
                db.DatPhong.Add(datPhong);
                await db.SaveChangesAsync();
            }

            return Ok(datPhong);
        }

        [HttpPut, Route("{datPhongID:int}")]
        public async Task<IHttpActionResult> Update(int datPhongID, [FromBody]DatPhong datPhong)
        {
            if (datPhong.DatPhongID != datPhongID) return BadRequest("Id mismatch");

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            using (var db = new dbQuanLyKhachSan())
            {
                db.Entry(datPhong).State = EntityState.Modified;

                try
                {
                    await db.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException ducEx)
                {
                    bool exists = db.DatPhong.Count(o => o.DatPhongID == datPhongID) > 0;
                    if (!exists)
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw ducEx;
                    }
                }

                return Ok(datPhong);
            }
        }

        [HttpDelete, Route("{datPhongID:int}")]
        public async Task<IHttpActionResult> Delete(int datPhongID)
        {
            using (var db = new dbQuanLyKhachSan())
            {
                var datPhong = await db.DatPhong.SingleOrDefaultAsync(o => o.DatPhongID == datPhongID);

                if (datPhong == null)
                    return NotFound();

                if (await db.HoaDon.AnyAsync(o => o.DatPhongID == datPhong.DatPhongID))
                    return BadRequest("Unable to delete the datphong as it has related hoadon");

                db.Entry(datPhong).State = EntityState.Deleted;

                await db.SaveChangesAsync();

                return Ok();
            }
        }

    }
}
