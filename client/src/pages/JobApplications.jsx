
import { useEffect, useState } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import Card from '../components/Common/Card';
import Button from '../components/Common/Button';
import { Briefcase, Plus, Trash2, Edit, X } from 'lucide-react';


// ==========================================
// CREATE ACTIVITY
// ==========================================
const createActivity = async ({
  type,
  message,
  details,
}) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      return;
    }

    await fetch(
      'http://localhost:5000/api/activity',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          type,
          message,
          details,
        }),
      }
    );

  } catch (error) {
    // Activity logging should never
    // break the main functionality.
    console.error(
      '❌ Activity creation error:',
      error
    );
  }
};


export default function JobApplications() {
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // ==========================================
  // EDIT MODE
  // ==========================================
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    company: '',
    position: '',
    status: 'pending',
    appliedDate: '',
    salary: '',
    location: '',
    jobUrl: '',
    notes: '',
  });


  // ==========================================
  // STATUS COLORS
  // ==========================================
  const statusColors = {
    pending:
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',

    accepted:
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',

    interview:
      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',

    rejected:
      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };


  // ==========================================
  // GET ALL APPLICATIONS
  // ==========================================
  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');

      if (!token) {
        setError('You are not logged in.');
        return;
      }

      const response = await fetch(
        'http://localhost:5000/api/job-applications',
        {
          method: 'GET',

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log('==========================================');
      console.log('💼 JOB APPLICATIONS RESPONSE');
      console.log(data);
      console.log('==========================================');

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Failed to fetch applications'
        );
      }

      setApplications(
        data.applications || []
      );

    } catch (error) {
      console.error(
        '❌ Fetch applications error:',
        error
      );

      setError(
        error.message ||
          'Failed to load job applications.'
      );

    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // LOAD APPLICATIONS
  // ==========================================
  useEffect(() => {
    fetchApplications();
  }, []);


  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData(
      (previousData) => ({
        ...previousData,
        [name]: value,
      })
    );
  };


  // ==========================================
  // RESET FORM
  // ==========================================
  const resetForm = () => {
    setFormData({
      company: '',
      position: '',
      status: 'pending',
      appliedDate: '',
      salary: '',
      location: '',
      jobUrl: '',
      notes: '',
    });

    setEditingId(null);
    setShowForm(false);
    setError('');
  };


  // ==========================================
  // ADD APPLICATION
  // ==========================================
  const handleAddApplication = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError('');

      const token = localStorage.getItem('token');

      if (!token) {
        setError('You are not logged in.');
        return;
      }

      // Required fields validation
      if (
        !formData.company.trim() ||
        !formData.position.trim() ||
        !formData.appliedDate
      ) {
        setError(
          'Please fill all required fields marked with *.'
        );
        return;
      }

      const response = await fetch(
        'http://localhost:5000/api/job-applications',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      console.log('==========================================');
      console.log('💼 ADD APPLICATION RESPONSE');
      console.log(data);
      console.log('==========================================');

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Failed to add application'
        );
      }

      // Add application to UI
      setApplications(
        (previousApplications) => [
          data.application,
          ...previousApplications,
        ]
      );


      // ==========================================
      // CREATE ACTIVITY
      // ==========================================
      await createActivity({
        type: 'application',

        message: 'Job application added',

        details: `Applied to ${formData.position} at ${formData.company}`,
      });


      resetForm();

    } catch (error) {
      console.error(
        '❌ Add application error:',
        error
      );

      setError(
        error.message ||
          'Failed to add application.'
      );

    } finally {
      setSaving(false);
    }
  };


  // ==========================================
  // START EDIT
  // ==========================================
  const handleEdit = (application) => {
    setEditingId(application._id);

    setFormData({
      company: application.company || '',
      position: application.position || '',
      status:
        application.status || 'pending',

      appliedDate: application.appliedDate
        ? new Date(
            application.appliedDate
          )
            .toISOString()
            .split('T')[0]
        : '',

      salary: application.salary || '',
      location: application.location || '',
      jobUrl: application.jobUrl || '',
      notes: application.notes || '',
    });

    setShowForm(true);
    setError('');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };


  // ==========================================
  // UPDATE APPLICATION
  // ==========================================
  const handleUpdateApplication = async (
    event
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError('');

      const token = localStorage.getItem('token');

      if (!token) {
        setError('You are not logged in.');
        return;
      }

      // Required fields validation
      if (
        !formData.company.trim() ||
        !formData.position.trim() ||
        !formData.appliedDate
      ) {
        setError(
          'Please fill all required fields marked with *.'
        );
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/job-applications/${editingId}`,
        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      console.log('==========================================');
      console.log('✏️ UPDATE APPLICATION RESPONSE');
      console.log(data);
      console.log('==========================================');

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Failed to update application'
        );
      }

      // Update card immediately
      setApplications(
        (previousApplications) =>
          previousApplications.map(
            (application) =>
              application._id === editingId
                ? data.application
                : application
          )
      );


      // ==========================================
      // CREATE ACTIVITY
      // ==========================================
      await createActivity({
        type: 'application',

        message: 'Job application updated',

        details: `Updated application for ${formData.position} at ${formData.company}`,
      });


      resetForm();

    } catch (error) {
      console.error(
        '❌ Update application error:',
        error
      );

      setError(
        error.message ||
          'Failed to update application.'
      );

    } finally {
      setSaving(false);
    }
  };


  // ==========================================
  // DELETE APPLICATION
  // ==========================================
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('You are not logged in.');
        return;
      }

      // Find application before deleting
      const applicationToDelete =
        applications.find(
          (application) =>
            application._id === id
        );

      const response = await fetch(
        `http://localhost:5000/api/job-applications/${id}`,
        {
          method: 'DELETE',

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log('==========================================');
      console.log('🗑️ DELETE APPLICATION RESPONSE');
      console.log(data);
      console.log('==========================================');

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Failed to delete application'
        );
      }

      // Remove from UI
      setApplications(
        (previousApplications) =>
          previousApplications.filter(
            (application) =>
              application._id !== id
          )
      );


      // ==========================================
      // CREATE ACTIVITY
      // ==========================================
      if (applicationToDelete) {
        await createActivity({
          type: 'application',

          message: 'Job application deleted',

          details: `Deleted application for ${applicationToDelete.position} at ${applicationToDelete.company}`,
        });
      }

    } catch (error) {
      console.error(
        '❌ Delete application error:',
        error
      );

      setError(
        error.message ||
          'Failed to delete application.'
      );
    }
  };


  return (
    <MainLayout>

      <div className="space-y-6">

        {/* ==========================================
            HEADER
        ========================================== */}
        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Job Applications
            </h1>

            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Track your job applications
            </p>

          </div>


          <Button
            variant="primary"
            onClick={() => {

              if (showForm) {
                resetForm();

              } else {
                setShowForm(true);
                setError('');
              }

            }}
          >

            {showForm ? (
              <>
                <X
                  size={20}
                  className="mr-2"
                />
                Close
              </>
            ) : (
              <>
                <Plus
                  size={20}
                  className="mr-2"
                />
                Add Application
              </>
            )}

          </Button>

        </div>


        {/* ==========================================
            ERROR MESSAGE
        ========================================== */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg p-4">
            {error}
          </div>
        )}


        {/* ==========================================
            APPLICATION FORM
        ========================================== */}
        {showForm && (
          <Card>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              {editingId
                ? 'Edit Job Application'
                : 'Add Job Application'}
            </h2>


            <form
              onSubmit={
                editingId
                  ? handleUpdateApplication
                  : handleAddApplication
              }
              className="space-y-5"
            >

              {/* Company */}
              <div>

                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">

                  Company{' '}

                  <span className="text-red-500">
                    *
                  </span>

                </label>


                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. TCS"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />

              </div>


              {/* Position */}
              <div>

                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">

                  Job Position{' '}

                  <span className="text-red-500">
                    *
                  </span>

                </label>


                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="e.g. Full Stack Developer"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />

              </div>


              {/* Status */}
              <div>

                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Status
                </label>


                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >

                  <option value="pending">
                    Pending
                  </option>

                  <option value="interview">
                    Interview
                  </option>

                  <option value="accepted">
                    Accepted
                  </option>

                  <option value="rejected">
                    Rejected
                  </option>

                </select>

              </div>


              {/* Applied Date */}
              <div>

                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">

                  Applied Date{' '}

                  <span className="text-red-500">
                    *
                  </span>

                </label>


                <input
                  type="date"
                  name="appliedDate"
                  value={formData.appliedDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />

              </div>


              {/* Salary */}
              <div>

                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Salary Range
                </label>


                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="e.g. ₹5 - ₹8 LPA"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

              </div>


              {/* Location */}
              <div>

                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Location
                </label>


                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Chennai / Remote"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

              </div>


              {/* Job URL */}
              <div>

                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Job URL
                </label>


                <input
                  type="url"
                  name="jobUrl"
                  value={formData.jobUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

              </div>


              {/* Notes */}
              <div>

                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Notes
                </label>


                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add any notes..."
                  rows="3"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

              </div>


              {/* Submit */}
              <div className="flex justify-end">

                <Button
                  variant="primary"
                  type="submit"
                  disabled={saving}
                >
                  {saving
                    ? editingId
                      ? 'Updating...'
                      : 'Saving...'
                    : editingId
                      ? 'Update Application'
                      : 'Save Application'}
                </Button>

              </div>

            </form>

          </Card>
        )}


        {/* ==========================================
            APPLICATIONS
        ========================================== */}
        {loading ? (

          <Card>

            <div className="text-center py-10">

              <p className="text-slate-600 dark:text-slate-400">
                Loading applications...
              </p>

            </div>

          </Card>

        ) : applications.length === 0 ? (

          <Card>

            <div className="text-center py-10">

              <Briefcase
                size={40}
                className="mx-auto text-slate-400 mb-4"
              />

              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                No job applications yet
              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Click "Add Application" to start
                tracking your applications.
              </p>

            </div>

          </Card>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {applications.map((app) => (

              <Card key={app._id}>

                <div className="flex items-start justify-between mb-4">

                  <div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {app.company}
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {app.position}
                    </p>

                  </div>


                  <Briefcase
                    size={24}
                    className="text-indigo-600 dark:text-indigo-400"
                  />

                </div>


                <div className="space-y-3 mb-4">

                  <div>

                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Salary Range
                    </p>

                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {app.salary ||
                        'Not specified'}
                    </p>

                  </div>


                  <div>

                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Location
                    </p>

                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {app.location ||
                        'Not specified'}
                    </p>

                  </div>


                  <div>

                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Applied Date
                    </p>

                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {new Date(
                        app.appliedDate
                      ).toLocaleDateString()}
                    </p>

                  </div>

                </div>


                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      statusColors[app.status]
                    }`}
                  >
                    {app.status
                      ? app.status
                          .charAt(0)
                          .toUpperCase() +
                        app.status.slice(1)
                      : 'Pending'}
                  </span>


                  <div className="flex space-x-2">

                    {/* EDIT */}
                    <button
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                      title="Edit"
                      onClick={() =>
                        handleEdit(app)
                      }
                    >

                      <Edit
                        size={16}
                        className="text-indigo-600"
                      />

                    </button>


                    {/* DELETE */}
                    <button
                      onClick={() =>
                        handleDelete(app._id)
                      }
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                      title="Delete"
                    >

                      <Trash2
                        size={16}
                        className="text-red-600"
                      />

                    </button>

                  </div>

                </div>

              </Card>

            ))}

          </div>

        )}

      </div>

    </MainLayout>
  );
}

