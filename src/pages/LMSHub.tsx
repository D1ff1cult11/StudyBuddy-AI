import { useState, useEffect } from 'react';
import { GraduationCap, CheckCircle2, RefreshCw, UploadCloud, BookOpen, Layers, ShieldCheck, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { lmsService, type LMSCourse, type LMSAssignment } from '../utils/lms-integration';
import { studyAgent } from '../utils/ai-agent';
import { sound } from '../utils/audio';
import { launchConfetti } from '../utils/confetti';

export function LMSHub() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<LMSCourse[]>([]);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [gradingId, setGradingId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    setCourses(lmsService.getCourses());
  }, []);

  const handleSyncToDeck = async (course: LMSCourse, assignment: LMSAssignment) => {
    setSyncingId(assignment.id);
    sound.playFlip();

    try {
      const cards = await studyAgent.generateFlashcards(
        { text: assignment.content },
        `${course.code}: ${assignment.title}`
      );

      // Mark assignment as synced in LMS
      assignment.status = 'synced';
      lmsService.saveCourses(courses);
      setCourses([...courses]);

      sound.playSuccess();
      launchConfetti();
      setSuccessToast(`Created ${cards.length} cards from ${assignment.title}!`);
      setTimeout(() => setSuccessToast(null), 3500);
    } catch (e) {
      console.error(e);
    } finally {
      setSyncingId(null);
    }
  };

  const handleSubmitGrade = async (courseId: string, assignment: LMSAssignment) => {
    setGradingId(assignment.id);
    sound.playFlip();

    await lmsService.submitGrade(courseId, assignment.id, 95); // 95% mastery
    setCourses(lmsService.getCourses());
    sound.playSuccess();
    setSuccessToast(`Synced 95/100 grade to Canvas Gradebook!`);
    setTimeout(() => setSuccessToast(null), 3500);
    setGradingId(null);
  };

  return (
    <div className="animate-slide-up" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '4px' }}>
          <ChevronLeft size={24} />
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '1.4rem', letterSpacing: '-0.02em', margin: 0 }}>University LMS Hub</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>Canvas & Blackboard LTI 1.3 Sync</p>
        </div>
      </header>

      {/* Toast Notification */}
      {successToast && (
        <div style={{ background: 'rgba(16, 185, 129, 0.95)', color: 'white', padding: '0.75rem 1rem', borderRadius: '0.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)' }}>
          <CheckCircle2 size={18} />
          {successToast}
        </div>
      )}

      {/* Connected Platforms Bar */}
      <div className="glass-panel" style={{ padding: '0.9rem 1rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <GraduationCap size={22} color="var(--accent-primary)" />
          <div>
            <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>University Portal</span>
            <span style={{ fontSize: '0.72rem', color: '#10b981', display: 'block', fontWeight: 600 }}>● Canvas LMS & Blackboard Connected</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.06)', borderRadius: '1rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          <ShieldCheck size={12} color="#10b981" /> LTI 1.3 Verified
        </div>
      </div>

      {/* Courses List */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {courses.map(course => (
          <div key={course.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-primary)' }}>{course.code}</span>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)' }}>{course.name}</h4>
              </div>
              <span style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem', background: course.platform === 'canvas' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)', color: course.platform === 'canvas' ? '#f87171' : '#60a5fa', borderRadius: '1rem', fontWeight: 700, textTransform: 'capitalize' }}>
                {course.platform}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {course.assignments.map(assignment => (
                <div key={assignment.id} className="glass-panel" style={{ padding: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h5 style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.2rem' }}>{assignment.title}</h5>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Due: {assignment.dueDate} • {assignment.pointsPossible} pts</span>
                    </div>

                    {assignment.status === 'graded' && (
                      <span style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', borderRadius: '0.5rem', fontWeight: 700 }}>
                        Score: {assignment.gradeSubmitted}/{assignment.pointsPossible}
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, background: 'rgba(0,0,0,0.2)', padding: '0.5rem 0.75rem', borderRadius: '0.5rem' }}>
                    {assignment.content.slice(0, 110)}...
                  </p>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="btn-primary"
                      disabled={syncingId === assignment.id}
                      onClick={() => handleSyncToDeck(course, assignment)}
                      style={{ flex: 1, padding: '0.45rem 0.75rem', fontSize: '0.78rem' }}
                    >
                      {syncingId === assignment.id ? (
                        <><RefreshCw size={14} style={{ animation: 'spin 1.5s linear infinite' }} /> Synthesizing...</>
                      ) : assignment.status === 'synced' ? (
                        <><BookOpen size={14} /> Review Deck</>
                      ) : (
                        <><Layers size={14} /> Generate Flashcards</>
                      )}
                    </button>

                    <button
                      className="btn-glass"
                      disabled={gradingId === assignment.id}
                      onClick={() => handleSubmitGrade(course.id, assignment)}
                      style={{ padding: '0.45rem 0.75rem', fontSize: '0.78rem' }}
                    >
                      <UploadCloud size={14} />
                      {gradingId === assignment.id ? "Syncing..." : "Sync Grade"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
