// Enhanced Submit Component with Full Mobile Responsiveness
import React, { useState } from 'react';
import { useStore } from './store';
import { useTheme } from './App';
import { shallow } from 'zustand/shallow';
import { FiPlay, FiCheck, FiAlertCircle, FiActivity, FiChevronUp } from 'react-icons/fi';
import ValidationModal from './validationModal';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);
  const { isDark, isMobile, isTablet, screenSize } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStatsExpanded, setIsStatsExpanded] = useState(false);

  const handleSubmit = async () => {
    setIsModalOpen(true);
    setIsLoading(true);
    setValidationResult(null);

    try {
      // Prepare the pipeline data
      const pipelineData = {
        nodes: nodes,
        edges: edges
      };

      // Send to backend
      const response = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pipelineData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setValidationResult(result);
      
    } catch (error) {
      console.error('Error submitting pipeline:', error);
      setValidationResult({
        num_nodes: nodes.length,
        num_edges: edges.length,
        is_dag: false,
        error: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setValidationResult(null);
    setIsLoading(false);
  };

  const toggleStats = () => {
    setIsStatsExpanded(!isStatsExpanded);
  };

  const isDisabled = nodes.length === 0;
  const hasConnections = edges.length > 0;
  const isPipelineReady = nodes.length > 0 && hasConnections;

  // Responsive container styling
  const getContainerStyle = () => {
    const baseStyle = {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backdropFilter: 'blur(20px)',
      borderTop: `1px solid ${isDark ? 'rgba(105, 19, 224, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
      zIndex: 1000,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    };

    if (isMobile) {
      return {
        ...baseStyle,
        display: 'flex',
        flexDirection: 'column',
        padding: '12px 16px',
        paddingBottom: `max(12px, env(safe-area-inset-bottom))`, // Safe area for notched devices
        background: isDark 
          ? 'rgba(20, 19, 34, 0.98)' 
          : 'rgba(255, 255, 255, 0.98)',
        boxShadow: isDark 
          ? '0 -12px 40px rgba(105, 19, 224, 0.15)'
          : '0 -12px 40px rgba(0, 0, 0, 0.08)',
      };
    } else {
      return {
        ...baseStyle,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isTablet ? '16px 24px' : '20px 32px',
        height: isTablet ? '75px' : '80px',
        background: isDark 
          ? `linear-gradient(180deg, 
              rgba(10, 10, 15, 0.95) 0%, 
              rgba(20, 19, 34, 0.98) 100%
            )`
          : `linear-gradient(180deg, 
              rgba(255, 255, 255, 0.95) 0%, 
              rgba(248, 250, 252, 0.98) 100%
            )`,
        boxShadow: isDark 
          ? '0 -8px 32px rgba(105, 19, 224, 0.1)'
          : '0 -8px 32px rgba(0, 0, 0, 0.04)',
      };
    }
  };

  // Responsive stats styling
  const getStatsStyle = () => {
    if (isMobile) {
      return {
        display: 'flex',
        flexDirection: isStatsExpanded ? 'column' : 'row',
        alignItems: isStatsExpanded ? 'stretch' : 'center',
        gap: isStatsExpanded ? '8px' : '12px',
        marginBottom: '12px',
        transition: 'all 0.3s ease',
        maxHeight: isStatsExpanded ? '200px' : '40px',
        overflow: 'hidden',
      };
    } else {
      return {
        display: 'flex',
        alignItems: 'center',
        gap: isTablet ? '16px' : '24px',
        color: isDark ? 'rgba(167, 139, 250, 0.8)' : 'rgba(100, 116, 139, 0.8)',
        fontSize: isTablet ? '12px' : '13px',
        fontWeight: '500',
        fontFamily: 'inherit',
      };
    }
  };

  // Responsive stat item styling
  const getStatItemStyle = (isActive = false) => {
    const baseStyle = {
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '6px' : '10px',
      padding: isMobile ? '8px 12px' : (isTablet ? '8px 14px' : '10px 16px'),
      background: isDark 
        ? 'rgba(31, 27, 46, 0.6)' 
        : 'rgba(255, 255, 255, 0.6)',
      borderRadius: isMobile ? '6px' : '8px',
      border: `1px solid ${isDark ? 'rgba(105, 19, 224, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
      backdropFilter: 'blur(10px)',
      fontSize: isMobile ? '11px' : (isTablet ? '12px' : '13px'),
      fontWeight: '500',
      transition: 'all 0.2s ease',
      flex: isMobile && isStatsExpanded ? '1' : 'none',
      whiteSpace: 'nowrap',
    };

    if (isActive) {
      return {
        ...baseStyle,
        background: isDark 
          ? 'rgba(16, 185, 129, 0.15)' 
          : 'rgba(16, 185, 129, 0.1)',
        borderColor: isDark 
          ? 'rgba(16, 185, 129, 0.3)' 
          : 'rgba(16, 185, 129, 0.2)',
        color: isDark ? '#34d399' : '#059669',
      };
    }

    return baseStyle;
  };

  // Responsive button styling
  const getButtonStyle = () => {
    const baseStyle = {
      background: isDisabled 
        ? (isDark ? 'rgba(31, 27, 46, 0.6)' : 'rgba(248, 250, 252, 0.6)')
        : (isDark 
            ? `linear-gradient(135deg, #6913e0, #7c3aed)`
            : `linear-gradient(135deg, #3b82f6, #2563eb)`
          ),
      color: isDisabled 
        ? (isDark ? 'rgba(167, 139, 250, 0.5)' : 'rgba(100, 116, 139, 0.5)')
        : '#ffffff',
      border: isDisabled 
        ? `1px solid ${isDark ? 'rgba(105, 19, 224, 0.2)' : 'rgba(59, 130, 246, 0.2)'}` 
        : 'none',
      borderRadius: isMobile ? '8px' : '10px',
      padding: isMobile ? '12px 20px' : (isTablet ? '12px 28px' : '14px 32px'),
      fontSize: isMobile ? '13px' : (isTablet ? '13px' : '14px'),
      fontWeight: '600',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      boxShadow: isDisabled 
        ? 'none' 
        : (isDark
            ? `0 4px 20px rgba(105, 19, 224, 0.3), 
               0 1px 3px rgba(105, 19, 224, 0.4),
               inset 0 1px 0 rgba(255, 255, 255, 0.1)`
            : `0 4px 20px rgba(59, 130, 246, 0.25),
               0 1px 3px rgba(59, 130, 246, 0.3),
               inset 0 1px 0 rgba(255, 255, 255, 0.2)`
          ),
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      fontFamily: 'inherit',
      letterSpacing: '0.025em',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: isMobile ? '8px' : '10px',
      backdropFilter: 'blur(10px)',
      width: isMobile ? '100%' : 'auto',
      minHeight: isMobile ? '48px' : 'auto', // Ensure touch-friendly height
    };

    return baseStyle;
  };

  // Mobile stats toggle button
  const StatsToggleButton = () => (
    <button
      onClick={toggleStats}
      style={{
        background: 'none',
        border: `1px solid ${isDark ? 'rgba(105, 19, 224, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
        borderRadius: '6px',
        padding: '6px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: isDark ? 'rgba(167, 139, 250, 0.8)' : 'rgba(100, 116, 139, 0.8)',
        transition: 'all 0.2s ease',
        marginLeft: 'auto',
        flexShrink: 0,
      }}
    >
      <FiChevronUp 
        size={14} 
        style={{ 
          transform: isStatsExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease'
        }} 
      />
    </button>
  );

  // Stat indicator dot
  const StatDot = ({ isActive }) => (
    <div style={{
      width: isMobile ? '8px' : '10px',
      height: isMobile ? '8px' : '10px',
      borderRadius: '50%',
      background: isActive 
        ? (isDark ? '#6913e0' : '#3b82f6')
        : (isDark ? 'rgba(167, 139, 250, 0.4)' : 'rgba(100, 116, 139, 0.4)'),
      boxShadow: isActive 
        ? `0 0 8px ${isDark ? '#6913e0' : '#3b82f6'}` 
        : 'none',
      transition: 'all 0.3s ease',
    }} />
  );

  return (
    <>
      <div style={getContainerStyle()}>
        {/* Subtle top border glow */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${
            isDark ? 'rgba(105, 19, 224, 0.4)' : 'rgba(59, 130, 246, 0.3)'
          }, transparent)`
        }} />

        {/* Pipeline Statistics */}
        <div style={getStatsStyle()}>
          {/* Mobile layout with toggle */}
          {isMobile && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              marginBottom: isStatsExpanded ? '8px' : '0',
            }}>
              <span style={{
                fontSize: '12px',
                fontWeight: '600',
                color: isDark ? '#f4f3ff' : '#0f172a',
              }}>
                Pipeline Status
              </span>
              <StatsToggleButton />
            </div>
          )}

          {/* Stats items */}
          <div style={{
            display: 'flex',
            flexDirection: isMobile && isStatsExpanded ? 'column' : 'row',
            alignItems: isMobile && isStatsExpanded ? 'stretch' : 'center',
            gap: isMobile ? (isStatsExpanded ? '6px' : '8px') : (isTablet ? '16px' : '24px'),
            width: isMobile ? '100%' : 'auto',
            flex: isMobile ? 1 : 'none',
          }}>
            <div style={getStatItemStyle()}>
              <StatDot isActive={nodes.length > 0} />
              <FiActivity size={isMobile ? 12 : 14} />
              <span>
                {nodes.length} Component{nodes.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div style={getStatItemStyle()}>
              <StatDot isActive={hasConnections} />
              <FiCheck size={isMobile ? 12 : 14} />
              <span>
                {edges.length} Connection{edges.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Pipeline Status Indicator */}
            <div style={getStatItemStyle(isPipelineReady)}>
              {isPipelineReady ? (
                <>
                  <FiCheck size={isMobile ? 12 : 14} />
                  <span>Pipeline Ready</span>
                </>
              ) : (
                <>
                  <FiAlertCircle size={isMobile ? 12 : 14} />
                  <span>In Progress</span>
                </>
              )}
            </div>

            {/* Additional mobile-only stats when expanded */}
            {isMobile && isStatsExpanded && (
              <>
                <div style={getStatItemStyle()}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: isDark ? '#34d399' : '#059669',
                  }} />
                  <span>Screen: {screenSize.width}×{screenSize.height}</span>
                </div>
                <div style={getStatItemStyle()}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: isDark ? '#6913e0' : '#3b82f6',
                  }} />
                  <span>Mode: {isDark ? 'Dark' : 'Light'}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit"
          onClick={handleSubmit}
          disabled={isDisabled}
          style={getButtonStyle()}
          onMouseEnter={(e) => {
            if (!isDisabled && !isMobile) { // Only on non-mobile devices
              e.target.style.transform = 'translateY(-2px) scale(1.02)';
              e.target.style.boxShadow = isDark
                ? `0 8px 30px rgba(105, 19, 224, 0.4), 
                   0 4px 8px rgba(105, 19, 224, 0.5),
                   inset 0 1px 0 rgba(255, 255, 255, 0.15)`
                : `0 8px 30px rgba(59, 130, 246, 0.35),
                   0 4px 8px rgba(59, 130, 246, 0.4),
                   inset 0 1px 0 rgba(255, 255, 255, 0.25)`;
            }
          }}
          onMouseLeave={(e) => {
            if (!isDisabled && !isMobile) {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = isDark
                ? `0 4px 20px rgba(105, 19, 224, 0.3), 
                   0 1px 3px rgba(105, 19, 224, 0.4),
                   inset 0 1px 0 rgba(255, 255, 255, 0.1)`
                : `0 4px 20px rgba(59, 130, 246, 0.25),
                   0 1px 3px rgba(59, 130, 246, 0.3),
                   inset 0 1px 0 rgba(255, 255, 255, 0.2)`;
            }
          }}
          onTouchStart={(e) => {
            if (!isDisabled && isMobile) { // Touch feedback for mobile
              e.target.style.transform = 'scale(0.98)';
              e.target.style.opacity = '0.8';
            }
          }}
          onTouchEnd={(e) => {
            if (!isDisabled && isMobile) {
              e.target.style.transform = 'scale(1)';
              e.target.style.opacity = '1';
            }
          }}
          onMouseDown={(e) => {
            if (!isDisabled && !isMobile) {
              e.target.style.transform = 'translateY(-1px) scale(0.98)';
            }
          }}
          onMouseUp={(e) => {
            if (!isDisabled && !isMobile) {
              e.target.style.transform = 'translateY(-2px) scale(1.02)';
            }
          }}
        >
          {/* Button Icon and Text */}
          {isDisabled ? (
            <>
              <FiAlertCircle size={isMobile ? 14 : 16} style={{ opacity: 0.7 }} />
              <span>{isMobile ? 'Add Components' : 'Add Components to Validate'}</span>
            </>
          ) : (
            <>
              <FiPlay size={isMobile ? 14 : 16} />
              <span>{isMobile ? 'Validate' : 'Validate Pipeline'}</span>
            </>
          )}
          
          {/* Button Highlight Effect - Desktop only */}
          {!isDisabled && !isMobile && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
              borderRadius: '10px 10px 0 0'
            }} />
          )}

          {/* Animated Gradient Overlay - Desktop only */}
          {!isDisabled && !isMobile && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
              animation: 'shimmer 3s infinite',
              borderRadius: '10px',
            }} />
          )}
        </button>

        {/* Mobile-specific quick actions */}
        {isMobile && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            marginTop: '8px',
            paddingTop: '8px',
            borderTop: `1px solid ${isDark ? 'rgba(105, 19, 224, 0.1)' : 'rgba(59, 130, 246, 0.1)'}`,
          }}>
            <button
              style={{
                background: 'none',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                color: isDark ? 'rgba(167, 139, 250, 0.7)' : 'rgba(100, 116, 139, 0.7)',
                fontSize: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onTouchStart={(e) => {
                e.target.style.backgroundColor = isDark ? 'rgba(31, 27, 46, 0.5)' : 'rgba(248, 250, 252, 0.5)';
              }}
              onTouchEnd={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              Clear All
            </button>
            <button
              style={{
                background: 'none',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                color: isDark ? 'rgba(167, 139, 250, 0.7)' : 'rgba(100, 116, 139, 0.7)',
                fontSize: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onTouchStart={(e) => {
                e.target.style.backgroundColor = isDark ? 'rgba(31, 27, 46, 0.5)' : 'rgba(248, 250, 252, 0.5)';
              }}
              onTouchEnd={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              Save Draft
            </button>
            <button
              style={{
                background: 'none',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                color: isDark ? 'rgba(167, 139, 250, 0.7)' : 'rgba(100, 116, 139, 0.7)',
                fontSize: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onTouchStart={(e) => {
                e.target.style.backgroundColor = isDark ? 'rgba(31, 27, 46, 0.5)' : 'rgba(248, 250, 252, 0.5)';
              }}
              onTouchEnd={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              Share
            </button>
          </div>
        )}

        {/* Custom CSS Animation for shimmer effect */}
        <style jsx>{`
          @keyframes shimmer {
            0% { left: -100%; }
            50% { left: -100%; }
            100% { left: 100%; }
          }

          /* Mobile-specific button ripple effect */
          @media (max-width: 767px) {
            @keyframes ripple {
              0% {
                transform: scale(0);
                opacity: 1;
              }
              100% {
                transform: scale(4);
                opacity: 0;
              }
            }

            .mobile-ripple {
              position: absolute;
              border-radius: 50%;
              background: rgba(255, 255, 255, 0.6);
              transform: scale(0);
              animation: ripple 0.6s linear;
              pointer-events: none;
            }
          }

          /* Enhanced touch feedback */
          @media (hover: none) and (pointer: coarse) {
            button:active {
              transform: scale(0.98) !important;
              transition: transform 0.1s ease !important;
            }
          }
        `}</style>
      </div>

      {/* Enhanced Validation Modal with responsive design */}
      <ValidationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        validationResult={validationResult}
        isLoading={isLoading}
        isMobile={isMobile}
        isDark={isDark}
      />
    </>
  );
};